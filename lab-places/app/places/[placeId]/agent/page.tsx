import { notFound } from 'next/navigation';
import { mockPlaceDetails } from '@/lib/mocks';
import { AgentChat } from '@/components/agent/AgentChat';

interface Props {
  params: Promise<{ placeId: string }>;
}

export default async function AgentPage({ params }: Props) {
  const { placeId } = await params;
  const place = mockPlaceDetails.find((p) => p.id === placeId);
  if (!place) notFound();
  return <AgentChat place={place} />;
}

export async function generateStaticParams() {
  return mockPlaceDetails.map((p) => ({ placeId: p.id }));
}
