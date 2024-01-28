import { useAPI } from "@/hooks/use-api";
import styles from "./connection-manager.module.css";
import { useEffect, useState } from "react";
import { useTractorbeamConfig } from "@/hooks/use-tractorbeam-config";
import { create } from "domain";
import { SWRConfiguration } from "swr";

type Provider = {
    provider_config: number;
    type: "oauth2" | "credentials" | "secret" | "custom";
    provider: {
        name: string;
        logo: string | null;
    };
};

type ProviderConfig = {
    id: number;
    project: number;
    provider: {
        logo: string;
        name: string;
        type: "oauth2" | "credentials" | "secret" | "custom";
    };
};

type Connection = {
    id: number;
    identity: string;
    provider_config: number;
    type: "oauth2" | "credentials" | "secret" | "custom";
    status: "pending" | "active" | "failed";
    provider: {
        logo: string;
        name: string;
    };

    oauth2_access_token?: string;
    oauth2_refresh_token?: string;
    oauth2_expires_at?: string;
    oauth2_scope?: string;

    credentials_username?: string;
    credentials_password?: string;

    secret_secret?: string;

    custom_json_data?: string;

    created_at: string;
    updated_at: string;
};

function useProviders(options?: SWRConfiguration<Provider[]>) {
    const { data, ...rest } = useAPI<Provider[]>("/api/client/provider-configs/", options);
    return { providers: data, ...rest };
}

function useConnections(options?: SWRConfiguration<Connection[]>) {
    const { data, ...rest } = useAPI<Connection[]>(`/api/client/connections/`, options);
    return { connections: data, ...rest };
}

function useConnection(connectionId: Connection["id"], options?: SWRConfiguration<Connection>) {
    const { data, ...rest } = useAPI<Connection>(
        `/api/client/connections/${connectionId}`,
        options,
    );
    return { connection: data, ...rest };
}

function useCreateConnection() {
    const { apiURL, token } = useTractorbeamConfig();

    return async ({identity, provider_config}: {
        identity: Connection["identity"];
        provider_config: Connection["provider_config"];
    }) => {
        const res = await fetch(`${apiURL}/api/client/connections/`, {
            method: "POST",
            body: JSON.stringify({
                identity,
                provider_config,
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
            `${apiURL}/api/client/connections/${connectionId}/`,
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

function toTitleCase(str: string) {
    return str[0].toUpperCase() + str.slice(1);
}

function ConnectionsList({
    onClickAdd,
    onClickEdit,
}: {
    onClickAdd: () => void;
    onClickEdit: (connectionId: number) => void;
}) {
    const { connections, error } = useConnections();
    const { apiURL } = useTractorbeamConfig();

    if (error) {
        return <div className={styles.listError}>{error.message}</div>;
    }

    if (!connections) {
        return <div className={styles.listLoading}>Loading...</div>;
    }

    const filteredConnections = connections.length
        ? connections.filter((c) => c.status !== "pending")
        : [];

    if (filteredConnections.length === 0) {
        return (
            <div className={styles.listEmpty}>
                <p>No connections.</p>
                <button className={styles.bigButton} onClick={onClickAdd}>
                    Add Connection
                </button>
            </div>
        );
    }

    return (
        <>
            <ul className={styles.providerList}>
                {filteredConnections.map((connection) => (
                    <li key={connection.id}>
                        <div className={styles.provider}>
                            <img
                                className={styles.providerLogo}
                                src={`${apiURL}${connection.provider?.logo}`}
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
    onClickConnect: (provider_config: number) => void;
}) {
    const { providers: provider_configs, error } = useProviders();
    const { apiURL } = useTractorbeamConfig();

    if (error) {
        return <div className={styles.listError}>{error.message}</div>;
    }

    if (!provider_configs) {
        return <div className={styles.listLoading}>Loading...</div>;
    }

    if (provider_configs.length === 0) {
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
                {provider_configs.map((pc) => (
                    <li key={pc.id}>
                        <div className={styles.provider}>
                            <img
                                className={styles.providerLogo}
                                src={`${apiURL}${pc.provider.logo}`}
                            />
                            <div className={styles.providerName}>
                                {toTitleCase(pc.provider.name)}
                            </div>
                            <button
                                className={styles.providerButton}
                                onClick={() => 
                                    onClickConnect(pc.id)
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
    connectionId: number;
    onClickBack: () => void;
    onClickDelete: (connectionId: Connection["id"]) => void;
    onConnect: () => void;
}) {
    const config = useTractorbeamConfig();
    console.log("ConfigureConnection", connectionId)
    const { connection, error } = useConnection(connectionId);

    if (error) {
        return <div className={styles.listError}>{error.message}</div>;
    }

    if (!connection) {
        return <div className={styles.listLoading}>Loading...</div>;
    }

    // TODO refactor to switch case
    if (connection.type === "oauth2") {
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

function useOAuth2AuthorizeURL(connectionId: Connection["id"], options?: SWRConfiguration<{ url: string }>) {
    const { data, ...rest } = useAPI<{ url: string }>(
        `/api/client/connections/${connectionId}/oauth2/authorize/`, options,
    );
    console.log("data", data)
    return { url: data?.url, ...rest };
}

function ConfigureOAuth2Connection({
    connectionId,
    onClickDelete,
    onClickBack,
}: {
    connectionId: number;
    onClickDelete: (connectionId: Connection["id"]) => void;
    onClickBack: () => void;
}) {
    const config = useTractorbeamConfig();
    const { connection, error: connectionError } = useConnection(connectionId, { refreshInterval: 500 });
    const { url, error: urlError } = useOAuth2AuthorizeURL(connectionId);

    if (connectionError || urlError) {
        const error = connectionError ?? urlError ?? new Error("Unknown Error");
        return <div className={styles.listError}>{error.message}</div>;
    }

    console.log("url", url)

    console.log("connection", connection)

    if (!url || !connection) {
        return <div className={styles.listLoading}>Loading...</div>;
    }

    const isConnected = !!connection.oauth2_access_token;

    if (isConnected) {
        return (
            <div className={styles.listEmpty}>
                <img
                    src={`${config.apiURL}${connection.provider?.logo}`}
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
                src={`${config.apiURL}${connection.provider?.logo}`}
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
    const [connectionId, setConnectionId] = useState<number | null>(null);
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
                        onClickConnect={async (id) => {
                            console.log("onClickConnect", id, identity)
                            const c = await createConnection({
                                identity: identity,
                                provider_config: id,
                            });
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
