import React from 'react';
import {beforeEach, describe, expect, it} from '@jest/globals';
import renderer, {act} from 'react-test-renderer';
import {useCalculator} from '../src/hooks/useCalculadora';

let hook: ReturnType<typeof useCalculator> | undefined;

const HookHarness = () => {
  hook = useCalculator();
  return null;
};

const press = (action: () => void) => {
  act(() => {
    action();
  });
};

describe('useCalculator', () => {
  beforeEach(() => {
    hook = undefined;
    renderer.create(<HookHarness />);
  });

  it('adds values correctly', () => {
    press(() => hook?.buildNumber('2'));
    press(() => hook?.addOperation());
    press(() => hook?.buildNumber('2'));
    press(() => hook?.calculateResult());

    expect(hook?.number).toBe('4');
    expect(hook?.formula).toBe('4');
  });

  it('returns Error on division by zero', () => {
    press(() => hook?.buildNumber('8'));
    press(() => hook?.divideOperation());
    press(() => hook?.buildNumber('0'));
    press(() => hook?.calculateResult());

    expect(hook?.number).toBe('Error');
  });

  it('applies percent conversion to current number', () => {
    press(() => hook?.buildNumber('2'));
    press(() => hook?.buildNumber('5'));
    press(() => hook?.percentOperation());

    expect(hook?.number).toBe('0,25');
  });

  it('toggles sign for the active number', () => {
    press(() => hook?.buildNumber('5'));
    press(() => hook?.toggleSign());

    expect(hook?.number).toBe('-5');

    press(() => hook?.toggleSign());

    expect(hook?.number).toBe('5');
  });

  it('deletes operator and restores last operand', () => {
    press(() => hook?.buildNumber('1'));
    press(() => hook?.addOperation());
    press(() => hook?.deleteOperation());

    expect(hook?.formula).toBe('1');
    expect(hook?.number).toBe('1');
  });

  it('enforces the 12-digit limit', () => {
    '1234567890123'.split('').forEach(digit => {
      press(() => hook?.buildNumber(digit));
    });

    const digits = hook?.number.replace(/\D/g, '') ?? '';
    expect(digits.length).toBe(12);
  });

  it('formats thousands in the full expression', () => {
    '1000'.split('').forEach(digit => {
      press(() => hook?.buildNumber(digit));
    });
    press(() => hook?.addOperation());
    '2000'.split('').forEach(digit => {
      press(() => hook?.buildNumber(digit));
    });

    expect(hook?.formula).toBe('1.000 + 2.000');
  });
});
