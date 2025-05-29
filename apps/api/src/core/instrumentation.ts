import { opentelemetry } from '@elysiajs/opentelemetry'
import {BatchSpanProcessor, NodeTracerProvider} from "@opentelemetry/sdk-trace-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Resource } from '@opentelemetry/resources';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {context, trace} from "@opentelemetry/api";
import {ok, ResultAsync} from "neverthrow";
import {AppException} from "@core/exceptions";
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';

export const instrumentation = () => {
  return opentelemetry({
    serviceName: 'neat-api',
    resource: new Resource({
      'service.version': '1.0.0',
    }),
    instrumentations: [new PgInstrumentation()],
    spanProcessors: [/*new BatchSpanProcessor(new OTLPTraceExporter({
      url: 'http://localhost:4317',
    }), {scheduledDelayMillis: 1000})*/]
  })
}

const setupTracing = () => {
  const provider = new NodeTracerProvider({
    resource: new Resource({
      'service.name': 'neat-api',
      'service.version': '1.0.0',
    }),
  });

  const exporter = new OTLPTraceExporter({
    url: 'http://localhost:4317',
  });

  const processor = new BatchSpanProcessor(exporter);
  provider.addSpanProcessor(processor);
  provider.register();

  // Instrumentations automatiques pour Node.js
  registerInstrumentations({
    instrumentations: [
      getNodeAutoInstrumentations({
        // Activer les instrumentations pour les modules Node courants
        '@opentelemetry/instrumentation-fs': { enabled: true },
        '@opentelemetry/instrumentation-http': { enabled: true },
        '@opentelemetry/instrumentation-pg': {
          enabled: true,
          enhancedDatabaseReporting: true,
          requestHook: (span, queryInfo) => {
            console.log(queryInfo.query.name);
          },
          responseHook: (span, queryInfo) => {
            console.log(queryInfo.data.oid);
          }
        },
        // Ajoutez d'autres instrumentations selon vos besoins
      }),
    ],
  });

  return trace.getTracer('neat-api');
};

const tracer = setupTracing();

// Décorateur de méthode pour le traçage automatique
export function Trace(name?: string) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const methodName = name || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function(...args: any[]) {
      const tracer = trace.getTracer('neat-api');
      const span = tracer.startSpan(methodName);

      try {
        return await context.with(trace.setSpan(context.active(), span), () =>
          originalMethod.apply(this, args)
        );
      } catch (error) {
        console.log(error);
        //span.recordException(error);
        throw error;
      } finally {
        span.end();
      }
    };

    return descriptor;
  };
}

type NestedPaths<T> = T extends object
  ? {
    [K in keyof T & string]: T[K] extends object ? `${K}` | `${K}.${NestedPaths<T[K]>}` : `${K}`
  }[keyof T & string]
  : never;

type TraceConfig<P extends any[]> = {
  obfuscation?: Array<NestedPaths<P[number]>>,
  skipParams?: number[],
};

type ObfuscationConfig = {
  [key: string]: true | ObfuscationConfig;
};

const buildObfuscationConfig = (paths: string[]): ObfuscationConfig => {
  const config: ObfuscationConfig = {};
  for (const path of paths) {
    const keys = path.split('.');
    let current = config;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === keys.length - 1) {
        current[key] = true;
      } else {
        if (!(key in current)) {
          current[key] = {};
        }
        const next = current[key];
        if (next !== true && typeof next === 'object') {
          current = next;
        }
      }
    }
  }
  return config;
};

const obfuscateValue = (value: any, config: ObfuscationConfig): any => {
  if ((config === true as unknown as ObfuscationConfig)) {
    return '***';
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const result: Record<string, any> = {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        if (config && key in config) {
          result[key] = obfuscateValue(value[key], config[key] as ObfuscationConfig);
        } else {
          result[key] = value[key];
        }
      }
    }
    return result;
  }
  return value;
};


export const _trace = <Z, T extends (...args: any[]) => ResultAsync<Z, AppException>>(
  fn: T,
  name: string,
  traceConfig?: TraceConfig<Parameters<T>>
) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    const ctx = context.active();
    const span = tracer.startSpan(name, {}, ctx);
    try {

      const obfuscationConfig: ObfuscationConfig = traceConfig?.obfuscation ? buildObfuscationConfig(traceConfig.obfuscation) : {};

      const attributes = args.reduce((acc, arg, index) => {
        if (traceConfig?.skipParams?.includes(index)) {
          return acc;
        }
        if (arg && typeof arg === 'object' && !Array.isArray(arg)) {
          const safeArg = obfuscateValue(arg, obfuscationConfig);
          acc[`arg.${index}`] = JSON.stringify(safeArg);
        } else {
          acc[`arg.${index}`] = JSON.stringify(arg);
        }
        return acc;
      }, {} as Record<string, string>);

      span.setAttributes(attributes);

      return context.with(trace.setSpan(ctx, span), () => {
        const result = fn(...args);
        return result
          .map(value => {
            span.setAttribute(`result.success`, `true`);
            return value;
          })
          .mapErr(error => {
            span.setAttribute(`result.success`, `false`);
            span.setAttribute(`result.error`, JSON.stringify(error));
            span.end();
            return error;
          })
          .andThen((a) => {
            span.end();
            return ok(a);
          }) as ReturnType<T>;
      });
    } catch (e) {
      span.setAttribute(`result.success`, `false`);
      console.log(e) //TODO:
      //span.recordException(e);
      span.end();
      throw e;
    }
  };
};

type MethodConfig<T extends (...args: any) => any> = {
  name: string;
  config?: TraceConfig<Parameters<T>>;
};

export function traceRepository<T extends Record<string, (...args: any[]) => any>>(
  repository: T,
  configs: {
    [K in keyof T]?: MethodConfig<T[K]>;
  }
): T {
  const tracedRepository = { ...repository };

  for (const key in repository) {
    if (Object.prototype.hasOwnProperty.call(repository, key)) {
      const method = repository[key];
      const config = configs[key] || { name: `repository/${key}` };

      tracedRepository[key] = _trace(
        method,
        config.name,
        config.config
      ) as typeof method;
    }
  }

  return tracedRepository;
}

export function traceRepositoryFactory<
  F extends (...args: any[]) => Record<string, (...params: any[]) => any>,
>(
  factory: F,
  configs: {
    [K in keyof ReturnType<F>]?: {
      name: string;
      config?: {
        obfuscation?: string[];
        skipParams?: number[];
      };
    };
  }
) {
  return (...args: Parameters<F>): ReturnType<F> => {
    const repository = factory(...args);
    const tracedRepository = { ...repository };

    for (const key in repository) {
      if (Object.prototype.hasOwnProperty.call(repository, key)) {
        const method = repository[key];
        const config = configs[key] || { name: `factory/${key}` };
        tracedRepository[key] = _trace(method, config.name, config.config) as typeof method;
      }
    }

    return tracedRepository as ReturnType<F>;
  };
}