import { containsAtLeastOneDefined, containsAtLeastOneUndefined } from '../../../src/util/array';

describe('Array utils test', () => {
  test('containsAtLeastOneUndefined should return true when at lest one undefined in array', () => {
    const test = [undefined, 'test', 'test2'];

    const result = containsAtLeastOneUndefined(test);

    expect(result).toBe(true);
  });

  test('containsAtLeastOneUndefined should return false when no undefined in array', () => {
    const test = ['test', 'test2', 'test3'];

    const result = containsAtLeastOneUndefined(test);

    expect(result).toBe(false);
  });

  test('containsAtLeastOneDefined should return true when one defined element in array', () => {
    const test = ['test', undefined, undefined];

    const result = containsAtLeastOneDefined(test);

    expect(result).toBe(true);
  });

  test('containsAtLeastOneDefined should return false when no defined element in array', () => {
    const test = [undefined, undefined, undefined];

    const result = containsAtLeastOneDefined(test);

    expect(result).toBe(false);
  });
});
