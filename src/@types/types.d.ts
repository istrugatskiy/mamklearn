type route = {
    /**
     * Title of the page.
     */
    title: string;
    /**
     * Path of the page.
     */
    path: string;
    /**
     * Component name of the page.
     * @example 'my-style-page'
     */
    component: string;
    /**
     * Whether the page requires authentication.
     */
    require_auth: boolean;
    /**
     * Whether the page should be shown in the sidebar.
     */
    show_user: boolean;
    /**
     * Whether the page is a special path.
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
     * @returns A promise that resolves when the page is loaded.
     */
    load: () => Promise<void>;
    /**
     * A function which can be used to restrict access to the page.
     * @remarks This function is currently not implemented or used.
     * @returns True if the page can be accessed, false otherwise.
     */
    restrictor?: () => boolean;
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
     */
    $outlet: HTMLElement | null;
    /**
     * The routes that are part of the application.
     * @remarks This is a map of paths to routes.
     * @example '/': home,
     * @example '/404': not_found,
     */
    layout: { [key: string]: route };
};

/**
 * The options for the character.
 */
type char_options = 'Eyes' | 'Nose' | 'Mouth' | 'Shirt' | 'Arms';
