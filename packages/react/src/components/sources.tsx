import { useState } from 'react';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from './ui/input';
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
    <div className={cn('flex items-center p-3 gap-3 text-sm bg-white')}>
      <div className="h-6 w-6 ml-2">
        <img src={source.iconSrc} alt={`${source.name} Icon`} />
      </div>
      <div className="font-semibold flex-1">{source.name}</div>
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
    <div className="flex-1 border rounded-lg divide-y overflow-y-auto">
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
    <Card className="shadow-xl h-[32rem] w-[24rem] flex flex-col">
      <CardHeader>
        <CardTitle>Connect Data Sources</CardTitle>
        <CardDescription>
          Connect your data sources to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-auto pt-1">
        <Input
          className="mb-4"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <SourceCardList query={query} />
      </CardContent>
      <CardFooter className="flex-col gap-3 items-start">
        <p className="text-sm">
          Powered by{' '}
          <a href="//wadefletcher.com" className="text-primary font-semibold">
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
    <Card className="shadow-xl h-[32rem] w-[24rem] flex flex-col">
      <CardHeader>
        <CardTitle>Connect to {source.name}</CardTitle>
        <CardDescription>
          You'll be sent to {source.name} to securely log in to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-6">
        <div className="flex-1 flex items-center justify-center h-full bg-secondary rounded-lg border shadow-inner">
          <div className="w-24 p-4 rounded-lg border bg-white z-10 shadow-sm">
            <img src={source.iconSrc} alt={`${source.name} Icon`} />
          </div>

          <div className="h-[2px] bg-ring w-12"></div>

          <div className="w-24 p-4 rounded-lg bg-white z-10 border shadow-sm">
            <img
              src={'https://logo.clearbit.com/github.com'}
              alt="GitHub Icon"
            />
          </div>
        </div>
        <a href={source.connectLink} className={cn(buttonVariants(), 'w-full')}>
          Continue to {source.name}
          <ExternalLink className="w-4 h-4 mb-0.5 ml-1" />
        </a>
      </CardContent>
      <CardFooter className="flex-col gap-3 items-start">
        <p className="text-sm ">
          Powered by{' '}
          <a href="//wadefletcher.com" className="text-primary font-semibold">
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
    <Card className="shadow-xl h-[32rem] w-[24rem] flex flex-col">
      <CardHeader>
        <CardTitle>Connection Successful</CardTitle>
        <CardDescription>
          Your {source.name} account has been connected!
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex-col flex gap-3">
        <div className="flex-1 flex justify-center items-center">
          <div className="rounded-full p-6 bg-primary/10">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
        </div>
        <Button variant="secondary">Add Another Data Source</Button>
        <Button>Done</Button>
      </CardContent>
      <CardFooter className="flex-col gap-3 items-stretch">
        <p className="text-sm ">
          Powered by{' '}
          <a href="//wadefletcher.com" className="text-primary font-semibold">
            Tractorbeam
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

export function Sources() {
  return (
    <div className="m-10 w-full flex gap-10 antialiased">
      <ListSources />
      <SourceOAuth2Start />
      <SourceOauth2Complete />
    </div>
  );
}
