import React, {useRef} from 'react';
import {Animated, Text, View} from 'react-native';
import {colors, GlobalTheme} from '../theme/global-theme';
import {ButtonCalculadora} from '../components/ButtonCalculadora';
import {useCalculator} from '../hooks/useCalculadora';

export const CalculadoraScreen = () => {
  const {
    // Propiedades
    number,
    prevNumber,
    formula,

    // Métodos
    buildNumber,
    toggleSign,
    clean,
    deleteOperation,
    divideOperation,
    multiplyOperation,
    subtractOperation,
    addOperation,
    percentOperation,
    calculateResult,
  } = useCalculator();

  // ─────────────────────────────────────────────
  // Animated values para el efecto de "caída" al presionar "="
  // La fórmula baja y se desvanece, luego el resultado aparece en su lugar.
  // ─────────────────────────────────────────────
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleEquals = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 60,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      calculateResult();
      // Reset instantáneo para que el resultado aparezca en la posición original
      translateY.setValue(0);
      opacity.setValue(1);
    });
  };

  return (
    <View style={GlobalTheme.calculadoraView}>
      {/* ── DISPLAY ── */}
      <View style={GlobalTheme.viewTexto}>
        {/* 
          SUB-RESULTADO (pequeño arriba): muestra el acumulado/subtotal
          mientras el usuario construye la expresión. Ej: si la fórmula
          es "2 + 2 + 2", aquí se ve el resultado parcial "6".
          Solo aparece si es diferente a la fórmula (evita duplicado).
        */}
        <View style={GlobalTheme.viewResultadoPequeno}>
          {prevNumber !== '' && (
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={GlobalTheme.textResultadoPequeno}>
              {prevNumber}
            </Text>
          )}
        </View>

        {/* 
          FÓRMULA PRINCIPAL (grande, con animación de caída al presionar "="):
          Muestra la secuencia completa de la operación, ej: "2 + 2 + 2 + 2"
          para que el usuario vea el historial de lo que está calculando.
          
          NOTA: `formula` viene del hook sin formatear para preservar los operadores
          visibles (+ - x ÷). El formato de miles se aplica solo al `number` y 
          `prevNumber` que se muestran como números puros.
        */}
        <View style={GlobalTheme.viewResultado}>
          <Animated.Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[
              GlobalTheme.textResultado,
              {
                opacity: opacity,
                transform: [{translateY: translateY}],
              },
            ]}>
            {formula}
          </Animated.Text>
        </View>
      </View>

      {/* ── FILA 1: C | +/- | % | ÷ ── */}
      <View style={GlobalTheme.row}>
        <ButtonCalculadora
          onPress={clean}
          label="C"
          color={colors.lightGray}
          textColor="#000"
        />
        <ButtonCalculadora
          onPress={toggleSign}
          label="+/-"
          color={colors.blueLight}
          textColor="#000"
        />
        <ButtonCalculadora
          onPress={percentOperation}
          label="%"
          color={colors.blueLight}
          textColor="#000"
        />
        <ButtonCalculadora
          onPress={divideOperation}
          label="÷"
          color={colors.orange}
          textColor="#000"
        />
      </View>

      {/* ── FILA 2: 7 | 8 | 9 | x ── */}
      <View style={GlobalTheme.row}>
        <ButtonCalculadora onPress={() => buildNumber('7')} label="7" />
        <ButtonCalculadora onPress={() => buildNumber('8')} label="8" />
        <ButtonCalculadora onPress={() => buildNumber('9')} label="9" />
        <ButtonCalculadora
          onPress={multiplyOperation}
          label="x"
          color={colors.orange}
          textColor="#000"
        />
      </View>

      {/* ── FILA 3: 4 | 5 | 6 | - ── */}
      <View style={GlobalTheme.row}>
        <ButtonCalculadora onPress={() => buildNumber('4')} label="4" />
        <ButtonCalculadora onPress={() => buildNumber('5')} label="5" />
        <ButtonCalculadora onPress={() => buildNumber('6')} label="6" />
        <ButtonCalculadora
          onPress={subtractOperation}
          label="-"
          color={colors.orange}
          textColor="#000"
        />
      </View>

      {/* ── FILA 4: 1 | 2 | 3 | + ── */}
      <View style={GlobalTheme.row}>
        <ButtonCalculadora onPress={() => buildNumber('1')} label="1" />
        <ButtonCalculadora onPress={() => buildNumber('2')} label="2" />
        <ButtonCalculadora onPress={() => buildNumber('3')} label="3" />
        <ButtonCalculadora
          onPress={addOperation}
          label="+"
          color={colors.orange}
          textColor="#000"
        />
      </View>

      {/* ── FILA 5: 0 | , | Del | = ── */}
      <View style={GlobalTheme.row}>
        <ButtonCalculadora onPress={() => buildNumber('0')} label="0" />
        {/*
          El botón muestra "," (estilo colombiano/europeo)
          pero envía '.' al hook para que el parser matemático funcione.
          El formatDisplay del hook se encarga de mostrar la coma en pantalla.
        */}
        <ButtonCalculadora onPress={() => buildNumber('.')} label="," />
        <ButtonCalculadora
          onPress={deleteOperation}
          label="Del"
          color={colors.redLight}
          textColor="#000"
        />
        <ButtonCalculadora
          onPress={handleEquals}
          label="="
          color={colors.green}
          textColor="#000"
        />
      </View>
    </View>
  );
};
