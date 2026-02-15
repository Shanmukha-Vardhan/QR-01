import { QRWorkspace } from '@/components/qr/QRWorkspace';

export default function Home() {
  return (
    <div className="container min-h-[calc(100vh-8rem)] py-8 font-sans">
      <QRWorkspace />
    </div>
  );
}
