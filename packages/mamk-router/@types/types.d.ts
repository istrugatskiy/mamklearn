type route = {
    /**
     * Title of the page.
     */
    title: string;
    /**
     * Component name of the page.
     * @example 'my-style-page'
     */
    component: string;
    /**
     * Whether the page requires authentication.
     * By default, this is `false`.
     */
    require_auth?: boolean;
    /**
     * Whether the page is a special path.
     * @remarks A special path is a path that is not a page but rather an action.
     * @remarks The router will skip animation and UI updates for special paths.
     * @example '/login'
     * @example '/logout'
     */
    special_path?: boolean;
    /**
     * Must be in the format of a valid material icon or empty.
     */
    icon?: string;
    /**
     * Transition function used by the page. By default a swipe in transition function.
     */
    transition?: (outlet: HTMLElement, replace_route: () => void, resume_ui: () => void, is_forward: boolean) => Promise<void>;
    /**
     * The function that loads the page (or more typically any components it depends on).
     * @param redirect - A function that can be used to redirect the user to a different page.
     * @param on_auth_changed - A function that should be called when the authentication state changes.
     * @remarks While the loader function is allowed to call `redirect` and `on_auth_changed`, it is recommended that it does not (for most cases).
     * @returns A promise that resolves when the page is loaded. Note: the promise's value is ignored.
     */
    load: (redirect: (url: string) => void, on_auth_changed: (email?: string | null) => void) => Promise<unknown>;
};

type route_list = {
    /**
     * The route triggered when no authentication is present and the user requests a page with {@link require_auth}.
     */
    no_auth: route;
    /**
     * The route triggered when the user requests a page that does not exist.
     */
    not_found: route;
    /**
     * The outlet element to which pages are rendered.
     * @remarks This is typically a div.
     * @remarks If this is null, the router will attempt to use the element with the id `outlet`.
     */
    $outlet?: HTMLElement | null;
    /**
     * The routes that are part of the application.
     * @remarks This is a map of paths to routes.
     * @example '/': home,
     * @example '/404': not_found,
     */
    layout: { [key: string]: route };
};
