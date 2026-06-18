import { default as useTimer } from './timer';

describe('Timer hook', () => {
  test('should be defined', () => {
    expect(useTimer).toBeDefined();
  });

  test('should be a function', () => {
    expect(typeof useTimer).toBe('function');
  });
});