import React, {useRef} from 'react';
import {Animated, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ButtonCalculadora} from '../components/ButtonCalculadora';
import {useCalculator} from '../hooks/useCalculadora';
import {GlobalTheme} from '../theme/global-theme';

export const CalculadoraScreen = () => {
  const {
    number,
    prevNumber,
    formula,
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

  // Subtle HUD transition when pressing '=' to reinforce result feedback.
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const handleEquals = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 14,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0.35,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      calculateResult();
      translateY.setValue(0);
      opacity.setValue(1);
    });
  };

  return (
    <View style={GlobalTheme.calculatorContainer}>
      <LinearGradient
        colors={['#060611', '#030307']}
        style={GlobalTheme.backgroundGradient}
      />
      <View style={GlobalTheme.orbMagenta} pointerEvents="none" />
      <View style={GlobalTheme.orbCyan} pointerEvents="none" />

      <View style={GlobalTheme.displayPanel}>
        <View style={GlobalTheme.displayTopRow}>
          <Text style={GlobalTheme.displayLabel}>Calculadora</Text>
          <Text style={GlobalTheme.displaySubtotal}>
            {prevNumber === '' ? 'Ready' : prevNumber}
          </Text>
        </View>

        <Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={GlobalTheme.displayFormula}>
          {formula}
        </Text>

        <Animated.Text
          adjustsFontSizeToFit
          numberOfLines={1}
          style={[
            GlobalTheme.displayNumber,
            {
              opacity,
              transform: [{translateY}],
            },
          ]}>
          {number}
        </Animated.Text>
      </View>

      <View style={GlobalTheme.row}>
        <ButtonCalculadora onPress={clean} label="C" variant="danger" />
        <ButtonCalculadora onPress={toggleSign} label="+/-" variant="utility" />
        <ButtonCalculadora onPress={percentOperation} label="%" variant="utility" />
        <ButtonCalculadora onPress={divideOperation} label="÷" variant="operator" />
      </View>

      <View style={GlobalTheme.row}>
        <ButtonCalculadora onPress={() => buildNumber('7')} label="7" />
        <ButtonCalculadora onPress={() => buildNumber('8')} label="8" />
        <ButtonCalculadora onPress={() => buildNumber('9')} label="9" />
        <ButtonCalculadora onPress={multiplyOperation} label="x" variant="operator" />
      </View>

      <View style={GlobalTheme.row}>
        <ButtonCalculadora onPress={() => buildNumber('4')} label="4" />
        <ButtonCalculadora onPress={() => buildNumber('5')} label="5" />
        <ButtonCalculadora onPress={() => buildNumber('6')} label="6" />
        <ButtonCalculadora onPress={subtractOperation} label="-" variant="operator" />
      </View>

      <View style={GlobalTheme.row}>
        <ButtonCalculadora onPress={() => buildNumber('1')} label="1" />
        <ButtonCalculadora onPress={() => buildNumber('2')} label="2" />
        <ButtonCalculadora onPress={() => buildNumber('3')} label="3" />
        <ButtonCalculadora onPress={addOperation} label="+" variant="operator" />
      </View>

      <View style={GlobalTheme.row}>
        <ButtonCalculadora onPress={() => buildNumber('0')} label="0" />
        <ButtonCalculadora onPress={() => buildNumber('.')} label="," />
        <ButtonCalculadora onPress={deleteOperation} label="Del" variant="utility" />
        <ButtonCalculadora onPress={handleEquals} label="=" variant="equals" />
      </View>
    </View>
  );
};
