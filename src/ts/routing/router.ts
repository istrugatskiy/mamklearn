import { onAuthStateChanged } from 'firebase/auth';
import { routes } from './routes';
import { auth } from '../firebase-config';
import { default_transition } from './default-transition';

type state = {
    ready: boolean;
    signed_in: boolean;
    UI_halted: boolean;
    last_queued_route: string | undefined;
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
};

onAuthStateChanged(auth, (user) => {
    state.signed_in = !!user;
    state.ready = true;
    update_route();
});

const halt_UI = () => {
    console.log('halt');
    window.dispatchEvent(new CustomEvent('mamk-halt-ui', { bubbles: true, composed: true }));
    state.UI_halted = true;
};
const resume_UI = () => {
    console.log('resume');
    window.dispatchEvent(new CustomEvent('mamk-resume-ui', { bubbles: true, composed: true }));
    state.UI_halted = false;
};

const update_route = (_e?: Event, from_popstate: boolean = false) => {
    if (!state.ready) return;
    if (routes.$outlet) {
        window.dispatchEvent(new CustomEvent('mamk-route-change', { detail: window.location.pathname, bubbles: true, composed: true }));
        const { $outlet } = routes;
        const path = window.location.pathname || '/';
        let route = routes.layout[path] || routes.not_found;
        if (route.require_auth && !state.signed_in) {
            route = routes.no_auth;
        }
        if (state.UI_halted) {
            state.last_queued_route = path;
            return;
        }
        halt_UI();
        route
            .load()
            .then(() => {
                if (route.special_path) return;
                route.transition = route.transition ?? default_transition;
                route.transition(
                    $outlet,
                    () => {
                        const template = document.createElement(route.component);
                        $outlet.replaceChildren(template);
                        window.document.title = route.title;
                    },
                    resume_UI,
                    !from_popstate
                );
            })
            .catch((err) => {
                // TODO: Show error page.
                console.error(err);
            });
    } else {
        console.error('No outlet found');
    }
};

export const redirect = (path: string, event?: Event) => {
    event?.preventDefault();
    if (path == window.location.pathname) {
        window.history.replaceState({}, '', path);
        return;
    }
    window.history.pushState({}, '', path);
    update_route();
};

window.addEventListener('load', update_route);
window.addEventListener('popstate', (e: Event) => update_route(e, true), false);
