import '../../../globals.css';
import './styles/eye.css';
import Tabs from './components/Tabs';

export default function EyeTestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[100dvh] pb-16 bg-neutral-50 eye-safe-text">
      {children}
      <Tabs />
    </div>
  );
}

