import type { TSchema } from '@sinclair/typebox';
import type { TypeCheck } from '@sinclair/typebox/compiler';

export const typeBoxValidator = <T extends TypeCheck<TSchema>, Z>(
  compiler: T,
  values: Z
) => {
  const all = [...compiler.Errors(values)];

  if (all.length === 0) {
    return;
  }

  return {
    fields: all.reduce((acc, val) => {
      const key = val.path.replaceAll('/', '');
      return {
        ...acc,
        [key]: val.message,
      };
    }, {}),
  };
};
