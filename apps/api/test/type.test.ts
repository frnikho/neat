import { describe, expect, test } from 'bun:test';
import { notEmpty, andThrow, handle, oneOreResultOption, oneOrOption, oneOrThrow, optionToResult } from '@core/type';
import {DbException, CacheException, Exception} from '@core/exceptions/';
import {ResultAsync} from 'neverthrow';
import {none, some} from 'fp-ts/Option';

describe('notEmpty', () => {
  test('should return true for non-null, non-undefined values', () => {
    expect(notEmpty('string')).toBe(true);
    expect(notEmpty(0)).toBe(true);
    expect(notEmpty(false)).toBe(true);
    expect(notEmpty({})).toBe(true);
    expect(notEmpty([])).toBe(true);
    expect(notEmpty(new Date())).toBe(true);
    expect(notEmpty(BigInt(123))).toBe(true);
    expect(notEmpty(Symbol('test'))).toBe(true);
    expect(notEmpty(new Map())).toBe(true);
    expect(notEmpty(new Set())).toBe(true);
  });

  test('should return false for null or undefined values', () => {
    expect(notEmpty(null)).toBe(false);
    expect(notEmpty(undefined)).toBe(false);
    expect(notEmpty(void 0)).toBe(false);
  });
});

describe('andThrow', () => {
  test('should throw the provided error', () => {
    const error = new Error('Test error');
    expect(() => andThrow(error)).toThrow('Test error');
  });

  test('should throw custom exceptions', () => {
    expect(() => andThrow(new DbException('DB error'))).toThrow('DB error');
    expect(() => andThrow(new CacheException('Cache error'))).toThrow('Cache error');
    expect(() => andThrow(new Exception('General error'))).toThrow('General error');
  });

  test('should preserve error instance type', () => {
    const dbError = new DbException('DB error');
    expect(() => andThrow(dbError)).toThrow(DbException);
  });
});

describe('oneOrThrow', () => {
  test('should return first element for non-empty array', () => {
    const result = oneOrThrow([1, 2, 3]);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(1);
  });

  test('should return error for empty array', () => {
    const result = oneOrThrow([], 'Test');
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBeInstanceOf(DbException);
  });

  test('should work with complex object arrays', () => {
    const objects = [{id: 1, name: 'test'}, {id: 2, name: 'test2'}];
    const result = oneOrThrow(objects);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual({id: 1, name: 'test'});
  });

  test('should handle arrays with one element', () => {
    const result = oneOrThrow([999]);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(999);
  });

  test('should work with custom error messages', () => {
    const result = oneOrThrow([], 'User');
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr().message).toBe('No User found');
  });
});

describe('oneOrOption', () => {
  test('should return Some with first element for non-empty array', () => {
    const result = oneOrOption([1, 2, 3]);
    expect(result).toEqual(some(1));
  });

  test('should return None for empty array', () => {
    const result = oneOrOption([]);
    expect(result).toEqual(none);
  });

  test('should handle arrays of different types', () => {
    expect(oneOrOption(['string'])).toEqual(some('string'));
    expect(oneOrOption([true])).toEqual(some(true));
    expect(oneOrOption([null])).toEqual(some(null));
    expect(oneOrOption([undefined])).toEqual(some(undefined));
  });

  test('should work with complex objects', () => {
    const obj = {test: 'value'};
    expect(oneOrOption([obj])).toEqual(some(obj));
  });

  test('should handle arrays with one element', () => {
    expect(oneOrOption([42])).toEqual(some(42));
  });
});

describe('handle', () => {
  test('should handle DbException', async () => {
    const dbError = new DbException('DB error');
    const result = await handle(ResultAsync.fromPromise(Promise.reject(dbError), (e) => e as DbException));
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe(dbError.toApiError());
  });

  test('should handle CacheException', async () => {
    const cacheError = new CacheException('Cache error');
    const result = await handle(ResultAsync.fromPromise(Promise.reject(cacheError), (e) => e as CacheException));
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe(cacheError.toApiError());
  });

  test('should handle Exception', async () => {
    const generalError = new Exception('General error');
    const result = await handle(ResultAsync.fromPromise(Promise.reject(generalError), (e) => e as Exception));
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe(generalError.toApiError());
  });

  test('should handle successful cases', async () => {
    const successResult = await handle(ResultAsync.fromPromise(Promise.resolve('success'), (e) => e as Exception));
    expect(successResult.isOk()).toBe(true);
    expect(successResult._unsafeUnwrap()).toBe('success');
  });

  test('should handle nested promises', async () => {
    const nestedPromise = Promise.resolve(Promise.resolve('nested'));
    const result = await handle(ResultAsync.fromPromise(nestedPromise, (e) => e as Exception));
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe('nested');
  });
});

describe('oneOreResultOption', () => {
  test('should return ok(none) for empty array', () => {
    const result = oneOreResultOption([]);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(none);
  });

  test('should return ok(some) with first element for non-empty array', () => {
    const result = oneOreResultOption([1, 2, 3]);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(some(1));
  });

  test('should handle arrays with different types', () => {
    expect(oneOreResultOption(['test'])._unsafeUnwrap()).toEqual(some('test'));
    expect(oneOreResultOption([{id: 1}])._unsafeUnwrap()).toEqual(some({id: 1}));
    expect(oneOreResultOption([null])._unsafeUnwrap()).toEqual(some(null));
  });

  test('should handle single element arrays', () => {
    const result = oneOreResultOption([42]);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(some(42));
  });

  test('should preserve array element types', () => {
    const date = new Date();
    const result = oneOreResultOption([date]);
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(some(date));
  });
});

describe('optionToResult', () => {
  test('should return ok with value for Some option', () => {
    const result = optionToResult(some(1), new Error('Test error'));
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(1);
  });

  test('should return err with provided error for None option', () => {
    const error = new Error('Test error');
    const result = optionToResult(none, error);
    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe(error);
  });

  test('should handle complex objects in Some', () => {
    const complexObj = {id: 1, nested: {value: 'test'}};
    const result = optionToResult(some(complexObj), new Error('Test error'));
    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toEqual(complexObj);
  });

  test('should work with different error types', () => {
    expect(optionToResult(none, new DbException('DB error'))._unsafeUnwrapErr()).toBeInstanceOf(DbException);
    expect(optionToResult(none, new CacheException('Cache error'))._unsafeUnwrapErr()).toBeInstanceOf(CacheException);
  });

  test('should handle null and undefined in Some', () => {
    expect(optionToResult(some(null), new Error('Test')).isOk()).toBe(true);
    expect(optionToResult(some(undefined), new Error('Test')).isOk()).toBe(true);
  });
});



