import React, { useEffect } from "react";
import { createContext } from "react";

type TractorbeamConfig = {
    token?: string;
    identity?: string;
    projectId?: number;
    apiURL: string;
};

const defaultConfig: TractorbeamConfig = {
    apiURL: "https://api.tractorbeam.ai",
};

export const TractorbeamConfigContext =
    createContext<TractorbeamConfig>(defaultConfig);

export type TractorbeamTheme = {
    primaryColor?: string;
    primaryForegroundColor?: string;
    secondaryColor?: string;
    secondaryForegroundColor?: string;
    mutedColor?: string;
    borderColor?: string;
    errorColor?: string;
    radius?: string;
};

const defaultTheme: TractorbeamTheme = {
    primaryColor: "#000000",
    primaryForegroundColor: "#ffffff",
    secondaryColor: "rgb(228, 228, 231)",
    secondaryForegroundColor: "hsl(240 5.9% 10%)",
    borderColor: "#eaeaea",
    errorColor: "red",
    radius: "0.4rem",
};

type TractorbeamProviderProps = Pick<TractorbeamConfig, "token"> &
    Partial<Omit<TractorbeamConfig, "token">> & {
        children: React.ReactNode;
        theme?: TractorbeamTheme;
    };

export function TractorbeamProvider({
    children,
    theme = {},
    ...config
}: TractorbeamProviderProps) {
    useEffect(() => {
        const combinedTheme = { ...defaultTheme, ...theme };

        if (combinedTheme) {
            Object.entries(combinedTheme).forEach(([key, value]) => {
                document.documentElement.style.setProperty(
                    `--tb-${key.replace(
                        /[A-Z]/g,
                        (m) => "-" + m.toLowerCase(),
                    )}`,
                    value,
                );
            });
        }
    }, [theme]);

    return (
        <TractorbeamConfigContext.Provider
            value={{ ...defaultConfig, ...config }}
        >
            {children}
        </TractorbeamConfigContext.Provider>
    );
}
