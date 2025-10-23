import '../../globals.css';
import './styles/eye.css';
import Tabs from './components/Tabs';
import Disclaimer from './components/Disclaimer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] pb-14 bg-white eye-font">
      {children}
      <div className="px-3 py-2">
        <Disclaimer />
      </div>
      <Tabs />
    </div>
  );
}

