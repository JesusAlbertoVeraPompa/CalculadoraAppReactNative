import { StyleSheet } from "react-native"


export const colors = {
    darkGray: '#2D2D2D',
    lightGray: '#9B9B9B',
    orange: '#ff6702',
    blueLight: '#3d91ff',
    green: '#15ff6e',
    redLight: '#ff5252',

    textPrimary: '#fff',
    textSecondary: '#9b9b9b',
    background: '#000',
}

export const GlobalTheme = StyleSheet.create({
    homeScreenContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    calculadoraView: {
        flex: 1,
        padding: 20,
        justifyContent: 'flex-end',
    },
    viewTexto: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#131313',
        marginVertical: 10,
        paddingVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: `
        0px 4px 8px rgba(0, 0, 0, 0.7),
        inset 0px 2px 4px rgba(255, 255, 255, 0.15), 
        inset 0px -4px 6px rgba(0, 0, 0, 0.4)
        `,
    },
    viewResultado: {
        width: '95%',
        backgroundColor: '#1b1b1b',
    },
    viewResultadoPequeno: {
        width: '95%',
        backgroundColor: '#3b3b3b',
    },
    textResultado: {
        color: colors.textPrimary,
        fontSize: 70,
        textAlign: 'right',
        marginBottom: 10,
        fontWeight: '300',
    },
    textResultadoPequeno: {
        color: colors.textSecondary,
        fontSize: 40,
        textAlign: 'right',
        fontWeight: '300',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    button: {
        backgroundColor: colors.darkGray,
        width: 80,
        height: 80,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        boxShadow: `
        0px 4px 8px rgba(0, 0, 0, 0.7),
        inset 0px 2px 4px rgba(255, 255, 255, 0.15), 
        inset 0px -4px 6px rgba(0, 0, 0, 0.4)
        `,
    },
    buttonPressed: {
        /* Mantenemos el mismo color, tamaño y borde */
        backgroundColor: colors.darkGray,
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)', // El borde se oscurece un poco al hundirse

        /* EFECTO HUNDIDO (Pressed) */
        boxShadow: `
        /* 1. Eliminamos la sombra externa (0px) para que parezca pegado al fondo */
        0px 0px 0px rgba(0, 0, 0, 0),

        /* 2. Invertimos: Sombra oscura ARRIBA para simular el hueco */
        inset 0px 4px 6px rgba(0, 0, 0, 0.6),

        /* 3. Brillo tenue ABAJO para el borde que aún recibe algo de luz */
        inset 0px -1px 2px rgba(255, 255, 255, 0.1)
    `,

        /* Opcional: Un ligero escalado hacia abajo para reforzar el clic */
        transform: [{ scale: 0.96 }]
    },
    buttonText: {
        textAlign: 'center',
        padding: 10,
        fontSize: 30,
        color: colors.textPrimary,
        fontWeight: '500',
    },
})