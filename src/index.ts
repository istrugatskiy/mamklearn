// This is the new app entry point.

import './styles/globals.css';
import './styles/styles.css';
import './components/common';
import { init_particles } from '@istrugatskiy/mamk-particles';
import router from './scripts/router-config';
import './scripts/trolls';
import { app_version } from '../mamk-config.yaml';
import { onAuthStateChanged } from 'firebase/auth';
import { is_test, auth } from '@istrugatskiy/mamk-firewrap';

// Mamklearn version (used for analytics)
window.__mamkVersion = `v${app_version}#` + (document.currentScript as HTMLScriptElement)?.src;
if (!is_test) {
    onAuthStateChanged(auth, (user) => router.on_auth_changed(user?.email));
}

init_particles();
