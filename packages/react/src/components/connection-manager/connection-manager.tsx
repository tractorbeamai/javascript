import { useAPI } from "@/hooks/use-api";
import styles from "./connection-manager.module.css";
import { useState } from "react";
import { useTractorbeamConfig } from "@/hooks/use-tractorbeam-config";
import type { SWRConfiguration } from "swr";

type Provider = {
    slug: string;
    name: string;
    logo_url: string;
    provider_config_id: string;
};

type Connection = {
    id: string;
    identity: string;
    provider_config_id: string;

    status: "ACTIVE" | "PENDING" | "FAILED";

    provider: {
        name: string;
        slug: string;
        logo_url: string;
        is_oauth2: boolean;
    };

    connection_config?: unknown;
};

function useProviders() {
    const { data, ...rest } = useAPI<Provider[]>("/api/v1/providers/");
    return { providers: data, ...rest };
}

function useConnections() {
    const { data, ...rest } = useAPI<Connection[]>(`/api/v1/connections/`);
    return { connections: data, ...rest };
}

function useConnection(
    connectionId: Connection["id"],
    options?: SWRConfiguration<Connection>,
) {
    const { data, ...rest } = useAPI<Connection>(
        `/api/v1/connections/${connectionId}`,
    );
    return { connection: data, ...rest };
}

function useCreateConnection() {
    const { apiURL, token, identity } = useTractorbeamConfig();

    return async (providerConfigId: Connection["provider_config_id"]) => {
        const res = await fetch(`${apiURL}/api/v1/connections/`, {
            method: "POST",
            body: JSON.stringify({
                provider_config_id: providerConfigId,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data: Connection = await res.json();

        return data;
    };
}

function useDeleteConnection() {
    const { apiURL, token } = useTractorbeamConfig();

    return async (connectionId: Connection["id"]) => {
        const res = await fetch(
            `${apiURL}/api/v1/connections/${connectionId}/`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        return res.ok;
    };
}

function useRefreshConnectionData() {
    const { apiURL, token } = useTractorbeamConfig();

    return async (connectionId: Connection["id"]) => {
        const res = await fetch(
            `${apiURL}/api/client/connections/${connectionId}/refresh/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            },
        );

        const data: Connection = await res.json();

        return data;
    };
}

function toTitleCase(str: string) {
    return str[0].toUpperCase() + str.slice(1);
}

function ConnectionsList({
    onClickAdd,
    onClickEdit,
}: {
    onClickAdd: () => void;
    onClickEdit: (connectionId: Connection["id"]) => void;
}) {
    const { connections, error } = useConnections();
    const { apiURL } = useTractorbeamConfig();

    if (error) {
        return <div className={styles.listError}>{error.message}</div>;
    }

    if (!connections) {
        return <div className={styles.listLoading}>Loading...</div>;
    }

    const activeConnections = connections.length
        ? connections.filter((c) => c.status === "ACTIVE")
        : [];

    if (activeConnections.length === 0) {
        return (
            <>
                <div className={styles.listEmpty}>
                    <p>No connections.</p>
                </div>
                <button className={styles.bigButton} onClick={onClickAdd}>
                    Add Connection
                </button>
            </>
        );
    }

    return (
        <>
            <ul className={styles.providerList}>
                {activeConnections.map((connection) => (
                    <li key={connection.id}>
                        <div className={styles.provider}>
                            <img
                                className={styles.providerLogo}
                                src={`${apiURL}${connection.provider.logo_url}`}
                            />
                            <div className={styles.providerName}>
                                {toTitleCase(connection.provider.name)}
                            </div>
                            <button
                                className={styles.providerButton}
                                onClick={() => onClickEdit(connection.id)}
                            >
                                Edit
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <button className={styles.bigButton} onClick={onClickAdd}>
                Add Connection
            </button>
        </>
    );
}

function AddConnection({
    onClickBack,
    onClickConnect,
}: {
    onClickBack: () => void;
    onClickConnect: (providerConfigId: Provider["provider_config_id"]) => void;
}) {
    const { providers, error } = useProviders();
    const { apiURL } = useTractorbeamConfig();

    if (error) {
        return <div className={styles.listError}>{error.message}</div>;
    }

    if (!providers) {
        return <div className={styles.listLoading}>Loading...</div>;
    }

    if (providers.length === 0) {
        return (
            <div className={styles.listEmpty}>
                <p>No Providers Configured.</p>
                <button
                    style={{ marginTop: "0.5rem" }}
                    className={styles.secondaryButton}
                    onClick={onClickBack}
                >
                    Back
                </button>
            </div>
        );
    }

    return (
        <>
            <ul className={styles.providerList}>
                {providers.map((p) => (
                    <li key={p.provider_config_id}>
                        <div className={styles.provider}>
                            <img
                                className={styles.providerLogo}
                                src={`${apiURL}${p.logo_url}`}
                            />
                            <div className={styles.providerName}>
                                {toTitleCase(p.name)}
                            </div>
                            <button
                                className={styles.providerButton}
                                onClick={() =>
                                    onClickConnect(p.provider_config_id)
                                }
                            >
                                Connect
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <button
                className={`${styles.bigButton} ${styles.secondaryButton}`}
                onClick={onClickBack}
            >
                Back
            </button>
        </>
    );
}

function ConfigureConnection({
    connectionId,
    onClickBack,
    onClickDelete,
    onConnect,
}: {
    connectionId: Connection["id"];
    onClickBack: () => void;
    onClickDelete: (connectionId: Connection["id"]) => void;
    onConnect: () => void;
}) {
    const { connection, error } = useConnection(connectionId);

    if (error) {
        return <div className={styles.listError}>{error.message}</div>;
    }

    if (!connection) {
        return <div className={styles.listLoading}>Loading...</div>;
    }

    // TODO refactor to switch case
    if (connection.provider.is_oauth2) {
        return (
            <ConfigureOAuth2Connection
                connectionId={connectionId}
                onClickDelete={onClickDelete}
                onClickBack={onClickBack}
            />
        );
    }

    return <pre>{JSON.stringify(connection, null, 2)}</pre>;
}

type OAuth2Authorize = {
    redirect_url: string;
};

function useOAuth2AuthorizeURL(connectionId: Connection["id"]) {
    const { data, ...rest } = useAPI<OAuth2Authorize>(
        `/api/v1/oauth2/authorize/?connection_id=${connectionId}`,
    );
    return { url: data?.redirect_url, ...rest };
}

function RefreshDataButton({
    connectionId,
}: {
    connectionId: Connection["id"];
}) {
    const [loading, setLoading] = useState(false);
    const refreshConnectionData = useRefreshConnectionData();

    return (
        <button
            style={{ marginTop: "1rem" }}
            onClick={async () => {
                setLoading(true);
                await refreshConnectionData(connectionId);
                setLoading(false);
            }}
        >
            {loading ? <span>Loading...</span> : <span>Refresh Data</span>}
        </button>
    );
}

function ConfigureOAuth2Connection({
    connectionId,
    onClickDelete,
    onClickBack,
}: {
    connectionId: Connection["id"];
    onClickDelete: (connectionId: Connection["id"]) => void;
    onClickBack: () => void;
}) {
    const config = useTractorbeamConfig();
    const { connection, error: connectionError } = useConnection(connectionId, {
        refreshInterval: 500,
    });
    const { url, error: urlError } = useOAuth2AuthorizeURL(connectionId);

    if (connectionError || urlError) {
        const error = connectionError ?? urlError ?? new Error("Unknown Error");
        return <div className={styles.listError}>{error.message}</div>;
    }

    if (!url || !connection) {
        return <div className={styles.listLoading}>Loading...</div>;
    }

    const isConnected = !!connection.connection_config?.access_token;

    if (isConnected) {
        return (
            <div className={styles.listEmpty}>
                <img
                    src={`${config.apiURL}${connection.provider.logo_url}`}
                    className={styles.largeLogo}
                />
                <p>
                    You are connected to {toTitleCase(connection.provider.name)}
                    .
                </p>
                <p>Connection ID: {connection.id}</p>
                <button
                    style={{ marginTop: "1rem" }}
                    onClick={() => onClickDelete(connection.id)}
                >
                    Disconnect {toTitleCase(connection.provider.name)}
                </button>
                <button
                    style={{ marginTop: "0.5rem" }}
                    className={styles.secondaryButton}
                    onClick={onClickBack}
                >
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className={styles.listEmpty}>
            <img
                src={`${config.apiURL}${connection.provider.logo_url}`}
                className={styles.largeLogo}
            />
            <a href={url} target="_blank">
                <button style={{ marginTop: "1rem" }}>
                    Connect with {toTitleCase(connection.provider.name)}
                </button>
            </a>
            <button
                style={{ marginTop: "0.5rem" }}
                className={styles.secondaryButton}
                onClick={() => onClickDelete(connectionId)}
            >
                Cancel
            </button>
            <button
                className={`${styles.secondaryButton} ${styles.bigButton}`}
                onClick={onClickBack}
            >
                Back
            </button>
        </div>
    );
}

export function ConnectionManager() {
    type Screen = "list" | "add" | "configure";
    const [screen, setScreen] = useState<Screen>("list");
    const [history, setHistory] = useState<Screen[]>([]);
    const [connectionId, setConnectionId] = useState<Connection["id"] | null>(
        null,
    );
    const { identity, token, apiURL } = useTractorbeamConfig();
    const createConnection = useCreateConnection();
    const deleteConnection = useDeleteConnection();

    const titles: Record<Screen | "default", string> = {
        default: "Connection Manager",
        list: "Connection Manager",
        add: "Add Connection",
        configure: "Configure Connection",
    };

    function navigateTo(newScreen: Screen) {
        setHistory((history) => [...history, screen]);
        setScreen(newScreen);
    }

    function navigateBack() {
        const newHistory = [...history];
        const lastPage = newHistory.pop();
        setHistory(newHistory);
        setScreen(lastPage ?? "list");
    }

    return (
        <div className={styles.root}>
            <h2 className={styles.title}>{titles[screen] ?? titles.default}</h2>

            <div className={styles.content}>
                {screen === "list" && (
                    <ConnectionsList
                        onClickAdd={() => navigateTo("add")}
                        onClickEdit={(connectionId) => {
                            setConnectionId(connectionId);
                            navigateTo("configure");
                        }}
                    />
                )}
                {screen === "add" && (
                    <AddConnection
                        onClickBack={navigateBack}
                        onClickConnect={async (providerConfigId) => {
                            const c = await createConnection(providerConfigId);
                            setConnectionId(c.id);
                            navigateTo("configure");
                        }}
                    />
                )}
                {screen === "configure" && (
                    <ConfigureConnection
                        connectionId={connectionId}
                        onClickBack={navigateBack}
                        onClickDelete={async (connectionId) => {
                            await deleteConnection(connectionId);
                            setConnectionId(null);
                            navigateBack();
                        }}
                        onConnect={async () => {}}
                    />
                )}
            </div>

            <p className={styles.footer}>
                Powered by{" "}
                <a href="//tractorbeam.ai" className={styles.footerLink}>
                    Tractorbeam 🛸
                </a>
            </p>
        </div>
    );
}
