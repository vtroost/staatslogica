import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Denkers',
  description: 'Ontdek de verschillende denkers en perspectieven die Staatslogica analyseert. Van klassiek-liberalen tot anarcho-kapitalisten.',
};

export default function DenkersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 