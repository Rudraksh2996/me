import { createRoot } from 'react-dom/client';
import { KiboriLandingPage } from './shaders/kibori-landing-page/KiboriLandingPage';
import '../vendor/threeui/threeui.css';
import './style.css';
createRoot(document.getElementById('root')!).render(<main className="shader-frame"><KiboriLandingPage /></main>);
