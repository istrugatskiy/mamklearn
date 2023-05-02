import './outlet-transitions.css';
import { onAuthStateChanged } from 'firebase/auth';
import { routes } from './routes';
import { auth } from '../scripts/firebase-config';
import { default_transition } from './default-transition';
import config from '../../mamk-config.json';

type state = {
    ready: boolean;
    signed_in: boolean;
    UI_halted: boolean;
    last_queued_route: string | undefined;
    current_route_id: number;
};

const state: state = {
    // Whether the app is ready to be used, goes to true when authentication is ready.
    ready: false,
    // Whether the user is signed in.
    signed_in: false,
    // Whether the UI is halted, goes to true when a transition is in progress.
    UI_halted: false,
    // In the event that the user requests another transition while the UI is halted, this will store the path of the next route.
    last_queued_route: undefined,
    // The current route's ID, used for determining whether the app is going forwards or backwards.
    current_route_id: 0,
};

onAuthStateChanged(auth, (user) => {
    state.signed_in = !!user;
    const { valid_email_domains, admins } = config;
    state.ready = true;
    const is_valid_email = valid_email_domains.some((domain) => user?.email?.endsWith(`@${domain}`)) || admins.some((admin) => user?.email === admin);
    if (state.signed_in && !is_valid_email) {
        redirect(`/logout?invalid_email=true&email_ending=${user?.email?.split('@')[1]}`);
        state.signed_in = false;
        return;
    }
    update_route();
});

const halt_ui = () => {
    window.dispatchEvent(new CustomEvent('mamk-halt-ui', { bubbles: true, composed: true }));
    state.UI_halted = true;
};

const resume_ui = () => {
    window.dispatchEvent(new CustomEvent('mamk-resume-ui', { bubbles: true, composed: true }));
    state.UI_halted = false;
};

const update_route = (event?: Event) => {
    if (!state.ready) return;
    if (routes.$outlet) {
        const path = window.location.pathname || '/';
        if (state.UI_halted) {
            event?.preventDefault();
            state.last_queued_route = path;
            return;
        }
        window.dispatchEvent(new CustomEvent('mamk-route-change', { detail: window.location.pathname, bubbles: true, composed: true }));
        const { $outlet } = routes;
        let route = routes.layout[path] || routes.not_found;
        if (route.require_auth && !state.signed_in) {
            route = routes.no_auth;
        }
        if (!route.special_path) {
            halt_ui();
        }
        let is_forward = true;
        if (event?.type == 'popstate') {
            const index = history.state?.index ?? 0;
            if (index < state.current_route_id) {
                is_forward = false;
            }
            state.current_route_id = index;
        }
        route
            .load()
            .then(async () => {
                if (route.special_path) return;
                route.transition = route.transition ?? default_transition;
                await route.transition(
                    $outlet,
                    () => {
                        const template = document.createElement(route.component);
                        $outlet.replaceChildren(template);
                        window.document.title = route.title;
                    },
                    resume_ui,
                    is_forward
                );
                if (state.last_queued_route) {
                    // We can't check the current event but we can check the last event.
                    state.last_queued_route = undefined;
                    update_route();
                }
            })
            .catch((err) => {
                // TODO: Show error page.
                console.error(err);
            });
    } else {
        throw new Error('No outlet found.');
    }
};

export const redirect = (path: string, event?: Event) => {
    event?.preventDefault();
    if (path == window.location.pathname) {
        window.history.replaceState({ index: state.current_route_id }, '', path);
        return;
    }
    state.current_route_id++;
    window.history.pushState({ index: state.current_route_id }, '', path);
    update_route();
};

window.addEventListener('load', update_route);
window.addEventListener('popstate', update_route, false);
