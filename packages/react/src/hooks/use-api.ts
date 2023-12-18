import useSWR from "swr";
import { useTractorbeamConfig } from "./use-tractorbeam-config";

export function useAPI<T>(path: string) {
    const { token, apiURL } = useTractorbeamConfig();

    return useSWR<T>(`${apiURL}${path}`, (url: string) =>
        fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => res.json()),
    );
}
