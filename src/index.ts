// This is the new app entry point.

import './css/globals.css';
import './css/styles.css';
import './routing/router';
import './components/common';
import { init_particles } from './ts/load-particles';
import './ts/trolls';
import { app_version } from '../mamk-config.json';

// Mamklearn version (used for analytics)
window.__mamkVersion = `v${app_version}#` + (document.currentScript as HTMLScriptElement)?.src;

init_particles();
