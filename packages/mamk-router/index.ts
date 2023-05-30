import './outlet-transitions.css';
export { default_transition } from './default-transition';
import { default_transition } from './default-transition';

export const router = class {
    /**
     * The routes to use.
     * @remarks This is set by the constructor.
     */
    readonly routes: route_list;

    /**
     * The valid email domains to use for app login.
     */
    readonly email_domains: string[];

    /**
     * The list of admins for the app.
     * @example ilyastrug\@gmail.com
     */
    readonly admins: string[];

    /**
     * The current route's sequential ID.
     * @remarks This is used for determining whether the app is going forwards or backwards.
     */
    private current_route_id = 0;

    /**
     * Whether the user is signed in.
     */
    private signed_in = false;

    /**
     * Whether the user is signed in.
     * @remarks This is set by the `on_auth_changed` function.
     */
    get is_signed_in() {
        return this.signed_in;
    }

    /**
     * Whether the app is ready to be used, goes to true when authentication is ready.
     * @remarks Set to true after the first call to `on_auth_changed`.
     */
    private ready = false;

    /**
     * Whether the app is ready to be used, goes to true when authentication is ready.
     * @remarks Set to true after the first call to `on_auth_changed`.
     */
    get is_ready() {
        return this.ready;
    }

    /**
     * Whether the UI is halted.
     * @remarks The UI is halted when a transition is in progress
     * to prevent going out-of-sync with the URL.
     */
    private ui_halted = false;

    /**
     * The path of the next route to transition to, if any.
     * @remarks This is used when the user requests another transition while the UI is halted.
     */
    private last_queued_route?: string;

    /**
     * Starts the router.
     * @param routes - The routes to use.
     * @remarks This registers the `popstate` event listener by default.
     */
    constructor(routes: route_list, email_domains: string[], admins: string[]) {
        this.routes = routes;
        this.email_domains = email_domains;
        this.admins = admins;
        window.addEventListener('popstate', this.update_route, false);
    }

    /**
     * Redirects to the given path.
     * @param path - The path to redirect to.
     * @param event - The event that triggered the redirect (if any).
     */
    readonly redirect = (path: string, event?: Event) => {
        event?.preventDefault();
        if (path.startsWith('http') || path.startsWith('mailto:') || path.startsWith('tel:')) {
            window.open(path, '_blank', 'noopener noreferrer');
            return;
        }
        // This should never happen (and if it did would most likely be blocked), but just in case.
        if (path.toLowerCase().trim().startsWith('javascript:')) {
            throw new Error('Redirecting to JavaScript URLs is not allowed.');
        }
        if (path == window.location.pathname) {
            window.history.replaceState({ index: this.current_route_id }, '', path);
            return;
        }
        this.current_route_id++;
        window.history.pushState({ index: this.current_route_id }, '', path);
        this.update_route();
    };

    /**
     * A function that must be called, with a user's email, when the user's authentication state changes.
     * @param email - The user's email, or null if the user is not signed in.
     * @remarks If an app is not using authentication, this function should be called with `null`.
     * @remarks If an email is not part of the `email_domains` list, the user will be redirected to `/logout?invalid_email=true&email_ending={{encoded_uri_email_ending}}`.
     */
    readonly on_auth_changed = (email?: string | null) => {
        this.signed_in = !!email;
        this.ready = true;
        const is_valid_email = this.email_domains.some((domain) => email?.endsWith(`@${domain}`)) || this.admins.some((admin) => email === admin);
        if (this.signed_in && !is_valid_email) {
            this.redirect(`/logout?invalid_email=true&email_ending=${encodeURIComponent(email?.split('@')[1] ?? '')}`);
            this.signed_in = false;
            return;
        }
        this.update_route();
    };

    /**
     * Updates the UI to reflect the current route.
     * @param event - The event that triggered the route change (if any).
     */
    readonly update_route = (event?: Event) => {
        if (!this.ready) return;
        const routes = this.routes;
        routes.$outlet ??= document.getElementById('outlet');
        if (!routes.$outlet) throw new Error('No outlet found.');
        const path = window.location.pathname || '/';
        // If the UI is halted, queue the route change.
        if (this.ui_halted) {
            event?.preventDefault();
            this.last_queued_route = path;
            return;
        }
        // Dispatch a route change event.
        window.dispatchEvent(
            new CustomEvent('mamk-route-change', {
                detail: window.location.pathname,
                bubbles: true,
                composed: true,
            })
        );
        const { $outlet } = routes;
        // Determine the route to use.
        let route = routes.layout[path] || routes.not_found;
        if (route.require_auth && !this.signed_in) {
            route = routes.no_auth;
        }
        if (!route.special_path) {
            this.halt_ui();
        }
        let is_forward = true;
        if (event?.type == 'popstate') {
            const index = history.state?.index ?? 0;
            if (index < this.current_route_id) {
                is_forward = false;
            }
            this.current_route_id = index;
        }
        route
            .load(this.redirect, this.on_auth_changed)
            .then(async () => {
                if (route.special_path) return;
                route.transition ??= default_transition;
                await route.transition(
                    $outlet,
                    () => {
                        const template = document.createElement(route.component);
                        $outlet.replaceChildren(template);
                        window.document.title = route.title;
                    },
                    this.resume_ui,
                    is_forward
                );
                if (this.last_queued_route) {
                    this.last_queued_route = undefined;
                    this.update_route();
                }
            })
            .catch((err) => {
                // TODO: Show error page.
                console.error(err);
            });
    };

    /**
     * Halts the UI.
     */
    private readonly halt_ui = () => {
        window.dispatchEvent(new CustomEvent('mamk-halt-ui', { bubbles: true, composed: true }));
        this.ui_halted = true;
    };

    /**
     * Resumes the UI.
     */
    private readonly resume_ui = () => {
        window.dispatchEvent(new CustomEvent('mamk-resume-ui', { bubbles: true, composed: true }));
        this.ui_halted = false;
    };
};
