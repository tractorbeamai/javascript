import useSWR, { SWRConfiguration, SWRHook } from "swr";
import { useTractorbeamConfig } from "./use-tractorbeam-config";

export function useAPI<T>(path: string, options?: SWRConfiguration<T>) {
    const { token, apiURL } = useTractorbeamConfig();

    return useSWR<T>(
        `${apiURL}${path}`,
        (url: string) =>
            fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then((res) => res.json()),
        options,
    );
}
