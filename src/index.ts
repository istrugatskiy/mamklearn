// This is the new app entry point.

import './css/globals.css';
import './css/init.css';
import './routing/router';
import './components/common';
import { init_particles } from './ts/load-particles';
import './ts/trolls';

declare global {
    interface Window {
        WIZ_global_data: string;
        jQuery: {
            fn: {
                jquery: string;
            };
        };
        React: {
            version: string;
            Component: string;
        };
        __mamkVersion: string;
    }
}
// Mamklearn version (used for analytics)
window.__mamkVersion = 'v2.0.0#' + (document.currentScript as HTMLScriptElement)?.src;

init_particles();
