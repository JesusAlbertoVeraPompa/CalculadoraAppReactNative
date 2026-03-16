import React from 'react';
import {Pressable, Text} from 'react-native';
import {colors, GlobalTheme} from '../theme/global-theme';

// ─────────────────────────────────────────────
// Props del botón de la calculadora
// ─────────────────────────────────────────────
interface PropsPressable {
  label: string;
  color?: string;       // Color de fondo del botón (por defecto: gris oscuro)
  textColor?: string;   // Color del texto (por defecto: blanco)
  onPress: () => void;
}

export const ButtonCalculadora = ({
  label,
  color = colors.darkGray,
  textColor = colors.textPrimary,
  onPress,
}: PropsPressable) => {
  return (
    /*
      FIX: se eliminó el Fragment vacío (<>) que envolvía el Pressable
      innecesariamente. No causaba bug visual pero es mala práctica
      y genera un nodo extra en el árbol de componentes.
    */
    <Pressable
      onPress={onPress} // FIX: simplificado de `() => onPress()` a `onPress` directamente
      style={({pressed}) => ({
        ...GlobalTheme.button,
        backgroundColor: color,
        // Efecto visual al presionar: reducimos opacidad y escala
        opacity: pressed ? 0.6 : 1,
        transform: [{scale: pressed ? 0.92 : 1}],
        /*
          NOTA: el estilo `buttonPressed` definido en global-theme.ts
          nunca se llegaba a usar porque los estilos de pressed
          se aplican aquí inline. Se puede eliminar ese estilo del tema
          para mantener el código limpio.
        */
      })}>
      <Text style={{...GlobalTheme.buttonText, color: textColor}}>
        {label}
      </Text>
    </Pressable>
  );
};
