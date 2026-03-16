import {useEffect, useRef, useState} from 'react';

// ─────────────────────────────────────────────
// Enum de operadores — se usan con espacios para
// poder hacer split(' ') fácilmente en calculateTotal
// ─────────────────────────────────────────────
enum Operator {
  add = ' + ',
  subtract = ' - ',
  multiply = ' x ',
  divide = ' ÷ ',
}

// ─────────────────────────────────────────────
// Límite máximo de dígitos que puede tener un número.
// Evita desbordamiento visual y errores de precisión.
// ─────────────────────────────────────────────
const MAX_DIGITS = 12;

export const useCalculator = () => {
  // formula  → la expresión completa, ej: "1234 + 5678"  (siempre con '.' como decimal internamente)
  // number   → el número que se está escribiendo en este momento (sin formato)
  // prevNumber → resultado acumulado que se muestra pequeño arriba
  const [formula, setFormula] = useState('0');
  const [number, setNumber] = useState('0');
  const [prevNumber, setPrevNumber] = useState('');

  // isResult → true justo después de presionar "=", para que el próximo
  // dígito inicie una operación nueva en vez de concatenarse al resultado
  const isResult = useRef(false);

  // ─────────────────────────────────────────────
  // Calcula el subtotal en tiempo real SOLO cuando la fórmula
  // ya contiene al menos un operador (ej: "2500 + 1000").
  //
  // Comportamiento:
  //   - Escribiendo el primer número → prevNumber = '' (no aparece)
  //   - Al presionar operador        → prevNumber = subtotal (aparece)
  //   - Escribiendo el segundo número→ prevNumber se actualiza en vivo
  //   - Al presionar "=" o "C"       → prevNumber = '' (desaparece)
  // ─────────────────────────────────────────────
  useEffect(() => {
    // Si la fórmula no tiene operador, no mostrar nada
    const hasOperator = / [+\-x÷] /.test(formula);
    if (!hasOperator) return;

    const result = calculateTotal(formula);
    if (isFinite(result) && !isNaN(result)) {
      setPrevNumber(`${result}`);
    }
  }, [formula]);

  // ─────────────────────────────────────────────
  // Reinicia la calculadora por completo
  // ─────────────────────────────────────────────
  const clean = () => {
    setFormula('0');
    setNumber('0');
    setPrevNumber('');
    isResult.current = false;
  };

  // ─────────────────────────────────────────────
  // NUEVA FUNCIÓN: formatea un string numérico para
  // mostrarlo en pantalla con puntos de miles y coma decimal.
  //
  //   "1000000"    → "1.000.000"
  //   "1234.56"    → "1.234,56"
  //   "-9876.5"    → "-9.876,5"
  //   "Error"      → "Error"
  //
  // IMPORTANTE: esta función es solo para DISPLAY.
  // Internamente la fórmula siempre usa '.' como decimal.
  // ─────────────────────────────────────────────
  const formatDisplay = (value: string): string => {
    if (value === '' || value === 'Error') return value;

    // Separamos parte entera de decimal (el '.' es el separador interno)
    const [intPart, decPart] = value.split('.');

    // Añadimos puntos de miles a la parte entera con regex
    // \B → posición que NO es borde de palabra
    // (?=(\d{3})+(?!\d)) → seguida por grupos de 3 dígitos hasta el final
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Si hay parte decimal la unimos con coma (estilo colombiano / europeo)
    return decPart !== undefined
      ? `${formattedInt},${decPart}`
      : formattedInt;
  };

  // ─────────────────────────────────────────────
  // Construye el número dígito a dígito.
  // - Respeta el límite MAX_DIGITS
  // - No permite dos puntos decimales
  // - Si venimos de "=" empieza un número nuevo
  // ─────────────────────────────────────────────
  const buildNumber = (numberString: string) => {
    if (isResult.current) {
      // Venimos de "=": iniciamos número fresco
      isResult.current = false;
      setNumber(numberString === '.' ? '0.' : numberString);
      setFormula(numberString === '.' ? '0.' : numberString);
      return;
    }

    // Evitar doble punto decimal en el número actual
    if (number.includes('.') && numberString === '.') return;

    // FIX: límite de dígitos — contamos solo los dígitos numéricos del number actual
    const digitCount = number.replace(/[^0-9]/g, '').length;
    if (numberString !== '.' && digitCount >= MAX_DIGITS) return;

    if (formula === '0' && numberString !== '.') {
      // Reemplazar el "0" inicial en lugar de concatenar "07"
      setNumber(numberString);
      setFormula(numberString);
    } else {
      setNumber(number + numberString);
      setFormula(formula + numberString);
    }
  };

  // ─────────────────────────────────────────────
  // Agrega un operador a la fórmula.
  // Si el último carácter ya era un operador, lo reemplaza
  // para que el usuario pueda corregirlo sin borrar.
  // ─────────────────────────────────────────────
  const addOperator = (operator: Operator) => {
    isResult.current = false;

    if (formula.endsWith(' ')) {
      // Reemplazar el operador existente (3 chars: espacio+símbolo+espacio)
      // No recalculamos prevNumber porque el número base no cambió
      setFormula(formula.slice(0, -3) + operator);
    } else {
      // FIX: calcular y mostrar el subtotal acumulado SOLO al presionar un operador.
      // Así prevNumber aparece estable, sin parpadear mientras se escribe.
      const subtotal = calculateTotal(formula);
      if (isFinite(subtotal) && !isNaN(subtotal)) {
        setPrevNumber(`${subtotal}`);
      }
      setFormula(formula + operator);
    }

    // Vaciamos number para recibir el siguiente operando
    setNumber('');
  };

  // ─────────────────────────────────────────────
  // Parser de expresión matemática.
  // Recorre la fórmula de izquierda a derecha,
  // aplica operaciones en orden de aparición.
  //
  // FIX: división por cero → retorna NaN en lugar de Infinity
  // ─────────────────────────────────────────────
  const calculateTotal = (expression: string): number => {
    // Convertimos los símbolos visuales a operadores que JS entiende
    const cleanExpression = expression
      .replaceAll('x', '*')
      .replaceAll('÷', '/');

    const parts = cleanExpression.split(' ');
    if (parts.length === 0 || parts[0] === '') return 0;

    let total = parseFloat(parts[0]);
    if (isNaN(total)) return 0;

    for (let i = 1; i < parts.length; i += 2) {
      const op = parts[i];
      const val = parseFloat(parts[i + 1]);

      // Si todavía no se escribió el siguiente número, saltar
      if (isNaN(val)) continue;

      if (op === '+') total += val;
      if (op === '-') total -= val;
      if (op === '*') total *= val;
      if (op === '/') {
        // FIX: división por cero → NaN controlado
        if (val === 0) return NaN;
        total /= val;
      }
    }

    return total;
  };

  // ─────────────────────────────────────────────
  // Calcula el resultado final al presionar "=".
  // FIX: maneja división por cero y resultados inválidos
  // mostrando "Error" en pantalla en lugar de "Infinity" o "NaN".
  // ─────────────────────────────────────────────
  const calculateResult = () => {
    const finalResult = calculateTotal(formula);

    if (isNaN(finalResult) || !isFinite(finalResult)) {
      // Resultado inválido: mostramos "Error" y dejamos la calc lista para reinicio
      setFormula('Error');
      setNumber('Error');
      setPrevNumber('');
      isResult.current = true;
      return;
    }

    // Convertimos a string evitando notación científica en números grandes
    const resultString = `${finalResult}`;
    setFormula(resultString);
    setNumber(resultString);
    setPrevNumber('');
    isResult.current = true;
  };

  // ─────────────────────────────────────────────
  // Cambia el signo del número actual (+/-).
  //
  // FIX: antes usaba formula.replace(number, newNumber) que reemplazaba
  // la PRIMERA ocurrencia. Ej: "5 + 5" negaba el primer 5, no el segundo.
  // Ahora buscamos la ÚLTIMA ocurrencia con lastIndexOf para ser precisos.
  // ─────────────────────────────────────────────
  const toggleSign = () => {
    // No tiene sentido cambiar signo de vacío o cero
    if (!number || number === '0' || number === 'Error') return;

    const newNumber = number.startsWith('-')
      ? number.slice(1)       // Quitar signo negativo
      : '-' + number;         // Agregar signo negativo

    // FIX: reemplazar la ÚLTIMA ocurrencia del número en la fórmula
    const lastIndex = formula.lastIndexOf(number);
    if (lastIndex === -1) return;

    const newFormula =
      formula.slice(0, lastIndex) +
      newNumber +
      formula.slice(lastIndex + number.length);

    setFormula(newFormula);
    setNumber(newNumber);
  };

  // ─────────────────────────────────────────────
  // Borra el último carácter o el operador completo.
  //
  // FIX: antes, al borrar un operador, `number` quedaba en '' sin restaurarse.
  // Ahora extraemos el último número de la fórmula y lo seteamos correctamente.
  // ─────────────────────────────────────────────
  const deleteOperation = () => {
    // Si solo queda 1 carácter (o "Error"), limpiar todo
    if (formula.length <= 1 || formula === 'Error') return clean();

    if (formula.endsWith(' ')) {
      // Borrar operador: "1234 + " → "1234"  (3 chars: espacio+símbolo+espacio)
      const newFormula = formula.slice(0, -3);
      setFormula(newFormula);

      // FIX: restaurar el último número de la fórmula como number activo
      const parts = newFormula.split(' ');
      setNumber(parts[parts.length - 1]);

      // Al borrar el operador volvemos a tener solo un número sin operación,
      // así que ocultamos el prevNumber para no confundir al usuario
      setPrevNumber('');
    } else {
      // Borrar último dígito
      const newFormula = formula.slice(0, -1);
      const newNumber = number.slice(0, -1) || '0'; // Si queda vacío ponemos '0'
      setFormula(newFormula || '0');
      setNumber(newNumber);
    }
  };

  // ─────────────────────────────────────────────
  // NUEVA FUNCIÓN: implementa el botón "%"
  // Divide el número actual entre 100.
  // Ej: escribir 25 y presionar % → 0.25
  // ─────────────────────────────────────────────
  const percentOperation = () => {
    if (!number || number === 'Error') return;
    const currentNum = parseFloat(number);
    if (isNaN(currentNum)) return;

    const result = currentNum / 100;
    const resultString = `${result}`;

    // Reemplazar la última ocurrencia del número en la fórmula
    const lastIndex = formula.lastIndexOf(number);
    if (lastIndex === -1) return;

    const newFormula =
      formula.slice(0, lastIndex) +
      resultString +
      formula.slice(lastIndex + number.length);

    setFormula(newFormula);
    setNumber(resultString);
  };

  // ─────────────────────────────────────────────
  // Formatea la fórmula COMPLETA para el display.
  // Aplica puntos de miles a cada número dentro de la expresión
  // sin tocar los operadores (+, -, x, ÷).
  //
  // Ej: "1000 + 2000 x 3"  →  "1.000 + 2.000 x 3"
  //
  // IMPORTANTE: esta función es solo para mostrar en pantalla.
  // Internamente, `formula` sigue sin formato para que
  // calculateTotal pueda parsearla correctamente.
  // ─────────────────────────────────────────────
  const formatFormula = (expression: string): string => {
    if (expression === 'Error') return expression;

    // Dividimos por los operadores conservándolos con un grupo capturador
    // para poder re-unirlos después del formateo
    return expression
      .split(/( \+ | - | x | ÷ )/)
      .map(part => {
        // Si el fragmento es un operador, lo dejamos exactamente igual
        if ([' + ', ' - ', ' x ', ' ÷ '].includes(part)) return part;
        // Si es un número (con posible signo o decimal), lo formateamos
        return formatDisplay(part);
      })
      .join('');
  };

  // ─────────────────────────────────────────────
  // Retornamos los valores y métodos del hook.
  //
  // - `formula`    → expresión formateada para mostrar la secuencia completa
  //                  ej: "1.000 + 2.000 x 3"  (el historial de la operación)
  // - `number`     → número actual formateado con miles y coma decimal
  // - `prevNumber` → subtotal formateado que se muestra pequeño arriba
  // ─────────────────────────────────────────────
  return {
    // Propiedades
    // formula formateada para el display (historial de la operación)
    formula: formatFormula(formula),
    // number y prevNumber formateados con puntos de miles y coma decimal
    number: formatDisplay(number),
    prevNumber: formatDisplay(prevNumber),

    // Métodos
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
