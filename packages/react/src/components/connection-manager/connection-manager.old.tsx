"use client";

type DataSource = {
    type: "custom" | "oauth2" | "credentials" | "secret";
    id: number;
    beam: {
        id: number;
        name: string;
        logo: string;
    };
};

export function ConnectionManager({
    publishableKey,
    userId,
}: {
    publishableKey: string;
    userId: string;
}) {
    return <div>Connection Manager</div>;
}

function ConnectionManagerFooter() {
    return (
        <p className="text-sm">
            Powered by{" "}
            <a
                href="//tractorbeam.ai"
                className="tb-text-primary tb-font-semibold"
            >
                Tractorbeam
            </a>
        </p>
    );
}

function ConnectionManagerCard({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <Card className="root border tb-h-[32rem] tb-w-[24rem] tb-flex tb-flex-col">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="tb-flex-1 tb-flex-col tb-flex tb-gap-3">
                {children}
            </CardContent>
            <CardFooter>
                <ConnectionManagerFooter />
            </CardFooter>
        </Card>
    );
}

function DataSourceAction({
    status,
    onConnect,
}: {
    status: "disconnected" | "connected" | "coming-soon";
    onConnect?: () => void;
}) {
    switch (status) {
        case "disconnected":
            return (
                <Button variant="secondary" size="sm" onClick={onConnect}>
                    Connect
                </Button>
            );
        case "connected":
            return (
                <Button variant="outline" size="sm" disabled>
                    Connected
                </Button>
            );
        case "coming-soon":
            return (
                <Button variant="secondary" size="sm" disabled>
                    Coming Soon
                </Button>
            );
        default:
            return null;
    }
}

function DataSourceListItem({ source }: { source: Source }) {
    return (
        <div
            className={cn(
                "root tb-flex tb-items-center tb-p-3 tb-gap-3 tb-text-sm tb-bg-white",
            )}
        >
            <div className="tb-h-6 tb-w-6 tb-ml-2">
                <img src={source.iconSrc} alt={`${source.name} Icon`} />
            </div>
            <div className="tb-font-semibold tb-flex-1">{source.name}</div>
            <DataSourceAction
                status={source.status}
                onConnect={() => console.log("connect")}
            />
        </div>
    );
}

function DataSourceList({ query }: { query: string }) {
    const sources = useSources();

    return (
        <div className="root tb-flex-1 tb-border tb-rounded-lg tb-divide-y tb-overflow-y-auto">
            {sources
                .filter((source) =>
                    source.name.toLowerCase().includes(query.toLowerCase()),
                )
                .sort((a, b) => a.name.localeCompare(b.name))
                .sort((a, b) => {
                    if (a.status === "coming-soon") return 1;
                    if (b.status === "coming-soon") return -1;
                    return 0;
                })
                .map((source) => (
                    <DataSourceListItem key={source.id} source={source} />
                ))}
        </div>
    );
}
