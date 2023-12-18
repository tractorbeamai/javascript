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
};

const defaultTheme: TractorbeamTheme = {
    primaryColor: "red",
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
