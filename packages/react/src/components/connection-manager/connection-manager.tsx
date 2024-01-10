import { useAPI } from "@/hooks/use-api";
import styles from "./connection-manager.module.css";
import { useEffect, useState } from "react";
import { useTractorbeamConfig } from "@/hooks/use-tractorbeam-config";
import { create } from "domain";

type Provider = {
    providerConfigId: number;
    type: "oauth2" | "credentials" | "secret" | "custom";
    provider: {
        name: string;
        logo: string | null;
    };
};

type ProviderConfig = {
    id: number;
    projectId: number;
    provider: {
        logo: string;
        name: string;
        type: "oauth2" | "credentials" | "secret" | "custom";
    };
};

type Connection = {
    id: number;
    identity: string;
    providerConfigId: number;
    type: "oauth2" | "credentials" | "secret" | "custom";
    status: "pending" | "active" | "failed";
    provider: {
        logo: string;
        name: string;
    };

    oauth2_accessToken?: string;
    oauth2_refreshToken?: string;
    oauth2_expiresAt?: string;
    oauth2_scope?: string;

    credentials_username?: string;
    credentials_password?: string;

    secret_secret?: string;

    custom_jsonContents?: string;

    createdAt: string;
    updatedAt: string;
};

function useProviders() {
    const { data, ...rest } = useAPI<Provider[]>("/api/client/providers");
    return { providers: data, ...rest };
}

function useConnections() {
    const { data, ...rest } = useAPI<Connection[]>(`/api/client/connections`);
    return { connections: data, ...rest };
}

function useConnection(connectionId: Connection["id"]) {
    const { data, ...rest } = useAPI<Connection>(
        `/api/client/connections/${connectionId}`,
    );
    return { connection: data, ...rest };
}

function useCreateConnection() {
    const { apiURL, token } = useTractorbeamConfig();

    return async (body: {
        identity: Connection["identity"];
        providerConfigId: Connection["providerConfigId"];
    }) => {
        const res = await fetch(`${apiURL}/api/client/connections`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

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
    onClickEdit: (connectionId: number) => void;
}) {
    const { connections, error } = useConnections();

    if (error) {
        return <div className={styles.listError}>{error.message}</div>;
    }

    if (!connections) {
        return <div className={styles.listLoading}>Loading...</div>;
    }

    const filteredConnections = connections.filter(
        (c) => c.status !== "pending",
    );

    if (filteredConnections.length === 0) {
        return (
            <div className={styles.listEmpty}>
                <p>No connections.</p>
                <button className={styles.connectButton} onClick={onClickAdd}>
                    Add Connection
                </button>
            </div>
        );
    }

    return (
        <>
            <ul>
                {filteredConnections.map((connection) => (
                    <li key={connection.id}>
                        <div className={styles.provider}>
                            {/*<img className={styles.provider.logo} />*/}
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
            <button className={styles.connectButton} onClick={onClickAdd}>
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
    onClickConnect: (providerConfigId: number) => void;
}) {
    const { providers, error } = useProviders();

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
                <button className={styles.connectButton} onClick={onClickBack}>
                    Back
                </button>
            </div>
        );
    }

    return (
        <>
            <ul>
                {providers.map((p) => (
                    <li key={p.providerConfigId}>
                        <div className={styles.provider}>
                            {/*<img className={styles.provider.logo} />*/}
                            <div className={styles.providerName}>
                                {toTitleCase(p.provider.name)}
                            </div>
                            <button
                                className={styles.providerButton}
                                onClick={() =>
                                    onClickConnect(p.providerConfigId)
                                }
                            >
                                Connect
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <button className={styles.connectButton} onClick={onClickBack}>
                Back
            </button>
        </>
    );
}

function ConfigureConnection({
    connectionId,
    onClickBack,
    onConnect,
}: {
    connectionId: number;
    onClickBack: () => void;
    onConnect: () => void;
}) {
    const config = useTractorbeamConfig();
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
                onClickBack={onClickBack}
            />
        );
    }

    return <pre>{JSON.stringify(connection, null, 2)}</pre>;
}

function useOAuth2AuthorizeURL(connectionId: Connection["id"]) {
    const { data, ...rest } = useAPI<{ url: string }>(
        `/api/client/connections/${connectionId}/oauth2/authorize`,
    );
    return { url: data?.url, ...rest };
}

function ConfigureOAuth2Connection({
    connectionId,
    onClickDisconnect,
    onClickBack,
}: {
    connectionId: number;
    onClickDisconnect: (connectionId) => void;
    onClickBack: () => void;
}) {
    const config = useTractorbeamConfig();
    const { connection, error: connectionError } = useConnection(connectionId);
    const { url, error: urlError } = useOAuth2AuthorizeURL(connectionId);

    if (connectionError || urlError) {
        const error = connectionError ?? urlError ?? new Error("Unknown Error");
        return <div className={styles.listError}>{error.message}</div>;
    }

    if (!url || !connection) {
        return <div className={styles.listLoading}>Loading...</div>;
    }

    const isConnected = !!connection.oauth2_accessToken;

    if (isConnected) {
        return (
            <div className={styles.listEmpty}>
                <img
                    src={`${config.apiURL}${connection.provider.logo}`}
                    className={styles.largeLogo}
                />
                <p>
                    You are connected to {toTitleCase(connection.provider.name)}
                    .
                </p>
                <button
                    style={{ marginTop: "1rem" }}
                    onClick={() => onClickDisconnect(connection.id)}
                >
                    Disconnect {toTitleCase(connection.provider.name)}
                </button>
                <button style={{ marginTop: "0.5rem" }} onClick={onClickBack}>
                    Back
                </button>
            </div>
        );
    }

    return (
        <div className={styles.listEmpty}>
            <img
                src={`${config.apiURL}${connection.provider.logo}`}
                className={styles.largeLogo}
            />
            <a href={url} target="_blank">
                <button style={{ marginTop: "1rem" }}>
                    Connect with {toTitleCase(connection.provider.name)}
                </button>
            </a>
            <button style={{ marginTop: "0.5rem" }} onClick={onClickBack}>
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
            <h2 className={styles.title}>Connection Manager</h2>
            <p className={styles.description}>
                Description here lorem ipsum dolor sit amet
            </p>

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
                            const c = await createConnection({
                                identity: identity,
                                providerConfigId: id,
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
                        onConnect={async () => {}}
                    />
                )}
            </div>

            <p className={styles.footer}>
                Powered by{" "}
                <a href="//tractorbeam.ai" className={styles.footerLink}>
                    Tractorbeam
                </a>
            </p>
        </div>
    );
}
