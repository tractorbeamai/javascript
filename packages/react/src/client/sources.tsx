'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/card';
import { Input } from '@/ui/input';
import { CheckCircle, ExternalLink } from 'lucide-react';

const CONFIG = {
  apiUrl: 'https://tractorbeam-api.wbfletch.workers.dev',
  marketingUrl: 'https://tractorbeam.ai',
};

type Source = {
  id: number;
  name: string;
  iconSrc: string;
  status: 'connected' | 'disconnected' | 'coming-soon';
  connectLink?: string;
};

function useSources(): Source[] {
  return [
    {
      id: 1,
      name: 'Slack',
      iconSrc: 'https://logo.clearbit.com/slack.com',
      status: 'coming-soon',
    },
    {
      id: 2,
      name: 'Airtable',
      iconSrc: 'https://logo.clearbit.com/airtable.com',
      status: 'coming-soon',
    },
    {
      id: 3,
      name: 'Gmail',
      iconSrc: '',
      status: 'coming-soon',
    },
    {
      id: 4,
      name: 'Notion',
      iconSrc: 'https://logo.clearbit.com/notion.so',
      connectLink: `${CONFIG.apiUrl}/sources/notion/connect`,
      status: 'disconnected',
    },
    {
      id: 5,
      name: 'SQL',
      iconSrc: '',
      status: 'coming-soon',
    },
    {
      id: 6,
      name: 'Google Drive',
      iconSrc: 'https://logo.clearbit.com/google.com',
      status: 'coming-soon',
    },
    {
      id: 7,
      name: 'Github',
      iconSrc: 'https://logo.clearbit.com/github.com',
      status: 'coming-soon',
    },
  ];
}

function useSource(id: number): Source | null {
  return useSources().find((source) => source.id === id) ?? null;
}

function SourceCardAction({
  status,
  onConnect,
}: {
  status: Source['status'];
  onConnect?: () => void;
}) {
  switch (status) {
    case 'disconnected':
      return (
        <Button variant="secondary" size="sm" onClick={onConnect}>
          Connect
        </Button>
      );
    case 'connected':
      return (
        <Button variant="outline" size="sm" disabled>
          Connected
        </Button>
      );
    case 'coming-soon':
      return (
        <Button variant="secondary" size="sm" disabled>
          Coming Soon
        </Button>
      );
    default:
      return null;
  }
}

function SourceCard({ source }: { source: Source }) {
  return (
    <div
      className={cn(
        'root tb-flex tb-items-center tb-p-3 tb-gap-3 tb-text-sm tb-bg-white',
      )}
    >
      <div className="tb-h-6 tb-w-6 tb-ml-2">
        <img src={source.iconSrc} alt={`${source.name} Icon`} />
      </div>
      <div className="tb-font-semibold tb-flex-1">{source.name}</div>
      <SourceCardAction
        status={source.status}
        onConnect={() => console.log('connect')}
      />
    </div>
  );
}

function SourceCardList({ query }: { query: string }) {
  const sources = useSources();

  return (
    <div className="root tb-flex-1 tb-border tb-rounded-lg tb-divide-y tb-overflow-y-auto">
      {sources
        .filter((source) =>
          source.name.toLowerCase().includes(query.toLowerCase()),
        )
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort((a, b) => {
          if (a.status === 'coming-soon') return 1;
          if (b.status === 'coming-soon') return -1;
          return 0;
        })
        .map((source) => (
          <SourceCard key={source.id} source={source} />
        ))}
    </div>
  );
}

function ListSources() {
  const [query, setQuery] = useState('');

  return (
    <Card className="root tb-shadow-xl tb-h-[32rem] tb-w-[24rem] tb-flex tb-flex-col">
      <CardHeader>
        <CardTitle>Connect Data Sources</CardTitle>
        <CardDescription>
          Connect your data sources to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="tb-flex-1 tb-flex tb-flex-col tb-overflow-auto tb-pt-1">
        <Input
          className="tb-mb-4"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SourceCardList query={query} />
      </CardContent>
      <CardFooter className="tb-flex-col tb-gap-3 tb-items-start">
        <p className="text-sm">
          Powered by{' '}
          <a
            href="//wadefletcher.com"
            className="tb-text-primary tb-font-semibold"
          >
            Tractorbeam
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

function SourceOAuth2Start() {
  const source = useSource(4); // Notion

  if (!source) return null;

  return (
    <Card className="root tb-shadow-xl tb-h-[32rem] tb-w-[24rem] tb-flex tb-flex-col">
      <CardHeader>
        <CardTitle>Connect to {source.name}</CardTitle>
        <CardDescription>
          You'll be sent to {source.name} to securely log in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="tb-flex-1 tb-flex tb-flex-col tb-gap-6">
        <div className="tb-flex-1 tb-flex tb-items-center tb-justify-center tb-h-full tb-bg-secondary tb-rounded-lg tb-border tb-shadow-inner">
          <div className="tb-w-24 tb-p-4 tb-rounded-lg tb-border tb-bg-white tb-z-10 tb-shadow-sm">
            <img src={source.iconSrc} alt={`${source.name} Icon`} />
          </div>

          <div className="tb-h-[2px] tb-bg-ring tb-w-12"></div>

          <div className="tb-w-24 tb-p-4 tb-rounded-lg tb-bg-white tb-z-10 tb-border tb-shadow-sm">
            <img
              src={'https://logo.clearbit.com/github.com'}
              alt="GitHub Icon"
            />
          </div>
        </div>
        <a href={source.connectLink} className={cn(buttonVariants(), 'w-full')}>
          Continue to {source.name}
          <ExternalLink className="tb-w-4 tb-h-4 tb-mb-0.5 tb-ml-1" />
        </a>
      </CardContent>
      <CardFooter className="tb-flex-col tb-gap-3 tb-items-start">
        <p className="text-sm ">
          Powered by{' '}
          <a
            href="//wadefletcher.com"
            className="tb-text-primary tb-font-semibold"
          >
            Tractorbeam
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

function SourceOauth2Complete() {
  const source = useSource(4); // Notion

  if (!source) return null;

  return (
    <Card className="root tb-shadow-xl tb-h-[32rem] tb-w-[24rem] tb-flex tb-flex-col">
      <CardHeader>
        <CardTitle>Connection Successful</CardTitle>
        <CardDescription>
          Your {source.name} account has been connected!
        </CardDescription>
      </CardHeader>
      <CardContent className="tb-flex-1 tb-flex-col tb-flex tb-gap-3">
        <div className="tb-flex-1 tb-flex tb-justify-center tb-items-center">
          <div className="tb-rounded-full tb-p-6 tb-bg-primary/10">
            <CheckCircle className="tb-w-8 tb-h-8 tb-text-primary" />
          </div>
        </div>
        <Button variant="secondary">Add Another Data Source</Button>
        <Button>Done</Button>
      </CardContent>
      <CardFooter className="tb-flex-col tb-gap-3 tb-items-stretch">
        <p className="tb-text-sm ">
          Powered by{' '}
          <a
            href="//wadefletcher.com"
            className="tb-text-primary tb-font-semibold"
          >
            Tractorbeam
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

export function Sources() {
  return (
    <div className="root tb-m-10 tb-w-full tb-flex tb-gap-10 tb-antialiased">
      <ListSources />
      <SourceOAuth2Start />
      <SourceOauth2Complete />
    </div>
  );
}
