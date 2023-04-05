// This is the new app entry point.

import '../css/globals.css';
import '../css/init.css';
import '../css/outlet-transitions.css';
import './components/common';
import { init_particles } from './load-particles';
import './routing/router';
import './trolls';

init_particles();
