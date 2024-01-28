import { useTractorbeamConfig } from "./use-tractorbeam-config";

export function useQuery() {
    const { apiURL, token } = useTractorbeamConfig();

    return async (query: string) => {
        const response = await fetch(`${apiURL}/client/query/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ query }),
        });

        const { results } = await response.json();

        return results;
    };
}
