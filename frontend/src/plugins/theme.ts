import {
    Scheme,
    argbFromHex,
    themeFromSourceColor,
    hexFromArgb,
    alphaFromArgb,
    redFromArgb,
    greenFromArgb,
    blueFromArgb,
    argbFromRgb
} from "@material/material-color-utilities";

interface ThemeColors {
    [key: string]: string;
}

const commonColors = {
    "issue-open": "#00BA39",
    "issue-closed": "#FF0036",
    "issue-incoming": "#00C6EB",
    "issue-outgoing": "#FF8900"
};

const mainColorMappings: [string, keyof Scheme][] = [
    ["primary", "primary"],
    ["on-primary", "onPrimary"],
    ["secondary", "secondary"],
    ["on-secondary", "onSecondary"],
    ["tertiary", "tertiary"],
    ["on-tertiary", "onTertiary"],
    ["error", "error"],
    ["on-error", "onError"],
    ["primary-container", "primaryContainer"],
    ["on-primary-container", "onPrimaryContainer"],
    ["secondary-container", "secondaryContainer"],
    ["on-secondary-container", "onSecondaryContainer"],
    ["tertiary-container", "tertiaryContainer"],
    ["on-tertiary-container", "onTertiaryContainer"],
    ["error-container", "errorContainer"],
    ["on-error-container", "onErrorContainer"],
    ["outline", "outline"],
    ["outline-variant", "outlineVariant"]
];

const surfaceColorMappings: [string, number, number][] = [
    ["surface-container-lowest", 100, 4],
    ["surface-container-low", 96, 10],
    ["surface-container", 94, 12],
    ["surface-container-high", 92, 17],
    ["surface-container-highest", 90, 22],
    ["surface", 98, 6],
    ["on-surface", 10, 90],
    ["surface-variant", 90, 30],
    ["on-surface-variant", 30, 80],
    ["background", 98, 6],
    ["on-background", 10, 90],
    ["inverse-surface", 20, 90],
    ["on-inverse-surface", 95, 20]
];

const elevationMappings = [1, 3, 6, 8, 12];

function splitColor(color: number): [number, number, number, number] {
    return [alphaFromArgb(color), redFromArgb(color), greenFromArgb(color), blueFromArgb(color)];
}

function calculateElevatedSurfaceColor(surface: number, tint: number, elevation: number): number {
    const [_alpha, red, green, blue] = splitColor(surface);
    const [_tintAlpha, tintRed, tintGreen, tintBlue] = splitColor(tint);
    const elevationDp = elevationMappings[elevation - 1];
    const tintAlpha = (4.5 * Math.log(elevationDp + 1) + 2) / 100;
    const newRed = Math.round((1 - tintAlpha) * red + tintAlpha * tintRed);
    const newGreen = Math.round((1 - tintAlpha) * green + tintAlpha * tintGreen);
    const newBlue = Math.round((1 - tintAlpha) * blue + tintAlpha * tintBlue);
    return argbFromRgb(newRed, newGreen, newBlue);
}

export function generateThemeColors(color: string, dark: boolean): ThemeColors {
    const theme = themeFromSourceColor(argbFromHex(color));
    const scheme = dark ? theme.schemes.dark : theme.schemes.light;
    const colors: ThemeColors = {};
    mainColorMappings.forEach(([key, value]) => {
        colors[key] = hexFromArgb(scheme[value] as number);
    });
    surfaceColorMappings.forEach(([key, lightValue, darkValue]) => {
        const value = dark ? darkValue : lightValue;
        colors[key] = hexFromArgb(theme.palettes.neutral.tone(value));
    });

    const surfaceValue = dark ? 6 : 98;
    const surface = theme.palettes.neutral.tone(surfaceValue);
    const tintValue = dark ? 80 : 40;
    const tint = theme.palettes.primary.tone(tintValue);

    for (let i = 1; i <= 5; i++) {
        colors[`surface-elevated-${i}`] = hexFromArgb(calculateElevatedSurfaceColor(surface, tint, i));
        colors[`on-surface-elevated-${i}`] = colors[`on-surface`];
    }

    return {
        ...colors,
        ...commonColors
    };
}
