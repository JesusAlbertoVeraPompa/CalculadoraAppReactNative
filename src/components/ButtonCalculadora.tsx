import React from 'react';
import {Pressable, StyleProp, Text, ViewStyle} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {GlobalTheme} from '../theme/global-theme';

type ButtonVariant = 'number' | 'operator' | 'utility' | 'danger' | 'equals';

interface PropsPressable {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  color?: string;
  textColor?: string;
}

const variantConfig: Record<
  ButtonVariant,
  {container: StyleProp<ViewStyle>; textStyle: object}
> = {
  number: {
    container: GlobalTheme.buttonNumber,
    textStyle: {},
  },
  operator: {
    container: GlobalTheme.buttonOperator,
    textStyle: GlobalTheme.operatorText,
  },
  utility: {
    container: GlobalTheme.buttonUtility,
    textStyle: GlobalTheme.utilityText,
  },
  danger: {
    container: GlobalTheme.buttonDanger,
    textStyle: GlobalTheme.dangerText,
  },
  equals: {
    container: GlobalTheme.buttonEquals,
    textStyle: GlobalTheme.equalsText,
  },
};

export const ButtonCalculadora = ({
  label,
  onPress,
  variant = 'number',
  color,
  textColor,
}: PropsPressable) => {
  const currentVariant = variantConfig[variant];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({pressed}) => [
        GlobalTheme.buttonBase,
        currentVariant.container,
        color ? {backgroundColor: color} : null,
        pressed ? GlobalTheme.buttonPressed : null,
      ]}>
      {variant === 'equals' && (
        <LinearGradient
          colors={['#ff2bd6', '#00f5ff']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={GlobalTheme.buttonGradient}
        />
      )}
      <Text
        style={[
          GlobalTheme.buttonText,
          currentVariant.textStyle,
          textColor ? {color: textColor} : null,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
};
