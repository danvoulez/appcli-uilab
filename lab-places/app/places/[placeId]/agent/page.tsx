import { notFound } from 'next/navigation';
import { mockPlaceDetails } from '@/lib/mocks';
import { AgentChat } from '@/components/agent/AgentChat';

interface Props {
  params: Promise<{ placeId: string }>;
  searchParams: Promise<{ q?: string }>;
}

export default async function AgentPage({ params, searchParams }: Props) {
  const { placeId } = await params;
  const { q } = await searchParams;
  const place = mockPlaceDetails.find((p) => p.id === placeId);
  if (!place) notFound();
  // q comes from ActionRail non-href actions: ?q=<action label>
  return <AgentChat place={place} initialQuery={q} />;
}

export async function generateStaticParams() {
  return mockPlaceDetails.map((p) => ({ placeId: p.id }));
}
