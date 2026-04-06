import {useEffect, useRef, useState} from 'react';

enum Operator {
  add = ' + ',
  subtract = ' - ',
  multiply = ' x ',
  divide = ' ÷ ',
}

const MAX_DIGITS = 12;

export const useCalculator = () => {
  // Raw values used by the parser. Formatting is applied only for UI display.
  const [formula, setFormula] = useState('0');
  const [number, setNumber] = useState('0');
  const [prevNumber, setPrevNumber] = useState('');
  const isResult = useRef(false);

  // Updates the running subtotal only when an operator exists in the expression.
  useEffect(() => {
    const hasOperator = / [+-x÷] /.test(formula);
    if (!hasOperator) {
      return;
    }

    const result = calculateTotal(formula);
    if (isFinite(result) && !isNaN(result)) {
      setPrevNumber(`${result}`);
    }
  }, [formula]);

  const clean = () => {
    setFormula('0');
    setNumber('0');
    setPrevNumber('');
    isResult.current = false;
  };

  // UI formatter: thousand separator '.' and decimal separator ','.
  const formatDisplay = (value: string): string => {
    if (value === '' || value === 'Error') {
      return value;
    }

    const sign = value.startsWith('-') ? '-' : '';
    const normalized = sign ? value.slice(1) : value;
    const [intPart = '0', decPart] = normalized.split('.');
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return decPart !== undefined
      ? `${sign}${formattedInt},${decPart}`
      : `${sign}${formattedInt}`;
  };

  const buildNumber = (numberString: string) => {
    if (formula === 'Error' || number === 'Error') {
      clean();
    }

    if (isResult.current) {
      isResult.current = false;
      const nextNumber = numberString === '.' ? '0.' : numberString;
      setNumber(nextNumber);
      setFormula(nextNumber);
      return;
    }

    if (number.includes('.') && numberString === '.') {
      return;
    }

    const digitCount = number.replace(/[^0-9]/g, '').length;
    if (numberString !== '.' && digitCount >= MAX_DIGITS) {
      return;
    }

    if (number === '' && numberString === '.') {
      setNumber('0.');
      setFormula(`${formula}0.`);
      return;
    }

    if (formula === '0' && numberString !== '.') {
      setNumber(numberString);
      setFormula(numberString);
      return;
    }

    setNumber(`${number}${numberString}`);
    setFormula(`${formula}${numberString}`);
  };

  const addOperator = (operator: Operator) => {
    isResult.current = false;

    if (formula === 'Error') {
      return;
    }

    if (formula.endsWith(' ')) {
      setFormula(`${formula.slice(0, -3)}${operator}`);
    } else {
      const subtotal = calculateTotal(formula);
      if (isFinite(subtotal) && !isNaN(subtotal)) {
        setPrevNumber(`${subtotal}`);
      }
      setFormula(`${formula}${operator}`);
    }

    setNumber('');
  };

  // Sequential parser (left to right) to keep legacy behavior.
  const calculateTotal = (expression: string): number => {
    const cleanExpression = expression.replaceAll('x', '*').replaceAll('÷', '/');
    const parts = cleanExpression.split(' ');

    if (parts.length === 0 || parts[0] === '') {
      return 0;
    }

    let total = parseFloat(parts[0]);
    if (isNaN(total)) {
      return 0;
    }

    for (let i = 1; i < parts.length; i += 2) {
      const op = parts[i];
      const val = parseFloat(parts[i + 1]);

      if (isNaN(val)) {
        continue;
      }

      if (op === '+') {
        total += val;
      }
      if (op === '-') {
        total -= val;
      }
      if (op === '*') {
        total *= val;
      }
      if (op === '/') {
        if (val === 0) {
          return NaN;
        }
        total /= val;
      }
    }

    return total;
  };

  const calculateResult = () => {
    const finalResult = calculateTotal(formula);

    if (isNaN(finalResult) || !isFinite(finalResult)) {
      setFormula('Error');
      setNumber('Error');
      setPrevNumber('');
      isResult.current = true;
      return;
    }

    const resultString = `${finalResult}`;
    setFormula(resultString);
    setNumber(resultString);
    setPrevNumber('');
    isResult.current = true;
  };

  const toggleSign = () => {
    if (!number || number === '0' || number === 'Error') {
      return;
    }

    const newNumber = number.startsWith('-') ? number.slice(1) : `-${number}`;
    const lastIndex = formula.lastIndexOf(number);
    if (lastIndex === -1) {
      return;
    }

    const newFormula =
      formula.slice(0, lastIndex) +
      newNumber +
      formula.slice(lastIndex + number.length);

    setFormula(newFormula);
    setNumber(newNumber);
  };

  const deleteOperation = () => {
    if (formula.length <= 1 || formula === 'Error') {
      clean();
      return;
    }

    if (formula.endsWith(' ')) {
      const newFormula = formula.slice(0, -3);
      const parts = newFormula.split(' ');

      setFormula(newFormula || '0');
      setNumber(parts[parts.length - 1] || '0');
      setPrevNumber('');
      return;
    }

    const newFormula = formula.slice(0, -1);
    const newNumber = number.slice(0, -1);

    if (newFormula === '' || newFormula === '-') {
      setFormula('0');
      setNumber('0');
      setPrevNumber('');
      return;
    }

    setFormula(newFormula);
    setNumber(newNumber === '' || newNumber === '-' ? '0' : newNumber);

    if (!/ [+-x÷] /.test(newFormula)) {
      setPrevNumber('');
    }
  };

  const percentOperation = () => {
    if (!number || number === 'Error') {
      return;
    }

    const currentNum = parseFloat(number);
    if (isNaN(currentNum)) {
      return;
    }

    const resultString = `${currentNum / 100}`;
    const lastIndex = formula.lastIndexOf(number);
    if (lastIndex === -1) {
      return;
    }

    const newFormula =
      formula.slice(0, lastIndex) +
      resultString +
      formula.slice(lastIndex + number.length);

    setFormula(newFormula);
    setNumber(resultString);
  };

  // Formats each numeric token without changing operators.
  const formatFormula = (expression: string): string => {
    if (expression === 'Error') {
      return expression;
    }

    return expression
      .split(/( \+ | - | x | ÷ )/)
      .map(part => {
        if ([' + ', ' - ', ' x ', ' ÷ '].includes(part)) {
          return part;
        }

        return formatDisplay(part);
      })
      .join('');
  };

  return {
    formula: formatFormula(formula),
    number: formatDisplay(number),
    prevNumber: formatDisplay(prevNumber),
    buildNumber,
    clean,
    toggleSign,
    deleteOperation,
    percentOperation,
    addOperation: () => addOperator(Operator.add),
    subtractOperation: () => addOperator(Operator.subtract),
    multiplyOperation: () => addOperator(Operator.multiply),
    divideOperation: () => addOperator(Operator.divide),
    calculateResult,
  };
};
