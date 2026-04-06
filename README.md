# Calculadora React Native CLI

Aplicacion de calculadora movil desarrollada con React Native CLI + TypeScript.

## Capturas de pantalla

![Pantalla principal](src/assets/screenshot/imagenAPK.jpeg)

![Pantalla adicional](src/assets/screenshot/imagenCalculadora.jpeg)

## Estado actual

- UX redisenada en estilo cyberpunk (neon magenta/cian).
- Hook de calculo con comentarios tecnicos claros y formato de display local (miles con `.` y decimal con `,`).
- Hardening de firma Android aplicado.

## Funcionalidades

- Operaciones: suma, resta, multiplicacion, division.
- Porcentaje (`%`) sobre el numero activo.
- Cambio de signo (`+/-`).
- Borrado de ultimo digito u operador (`Del`).
- Control de errores: division por cero muestra `Error`.
- Limite de 12 digitos por numero.

## Estructura principal

```txt
ChatBunker/
├── src/
│   ├── components/ButtonCalculadora.tsx
│   ├── hooks/useCalculadora.ts
│   ├── screens/CalculadoraScreen.tsx
│   └── theme/global-theme.ts
├── __tests__/App.test.tsx
├── App.tsx
├── index.js
├── package.json
└── tsconfig.json
```

## Requisitos

- Node.js >= 18
- JDK 17
- Android SDK (API 24+)
- React Native CLI

## Scripts

- `npm start` inicia Metro.
- `npm run android` ejecuta Android debug.
- `npm run ios` ejecuta iOS debug.
- `npm run lint` ejecuta ESLint.
- `npm test` ejecuta Jest.

## Firma Android segura (release)

### 1) Crear keystore nuevo

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore my-upload-key.keystore \
  -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000
```

Mover a `android/app/`.

### 2) Crear archivo local de credenciales

Copiar el template:

```bash
cp android/keystore.properties.example android/keystore.properties
```

Editar `android/keystore.properties` con valores reales.

### 3) Generar release

```bash
cd android
./gradlew assembleRelease
```

APK esperado:

```txt
android/app/build/outputs/apk/release/app-release.apk
```

## Nota critica de seguridad

Si alguna contrasena o keystore se expuso anteriormente en el repositorio o historial git:

1. Genera un keystore nuevo.
2. Cambia alias y contrasenas.
3. Revoca credenciales comprometidas en tu canal de distribucion.
4. Limpia el historial git si aplica antes de publicar.

## Dependencias principales

- `react` 18.3.1
- `react-native` 0.76.5
- `react-native-linear-gradient` ^2.8.3
- `typescript` 5.0.4

## Licencia

Proyecto de uso privado.
