import { TractorbeamConfigContext } from "@/components/tractorbeam-provider";
import { useContext } from "react";
import * as jose from "jose";

export function useTractorbeamConfig() {
    const config = useContext(TractorbeamConfigContext);

    if (!config) {
        throw new Error(
            "Tractorbeam config not found. Did you forget to wrap your app in <TractorbeamProvider />?",
        );
    }

    if (!config.token) {
        throw new Error(
            "Tractorbeam API token not found. Did you forget to pass the `token` prop to <TractorbeamProvider />?",
        );
    }

    const payload = jose.decodeJwt(config.token);

    config.identity = payload.sub;
    config.projectId = payload.projectId as number;

    return config;
}
