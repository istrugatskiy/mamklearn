type route = {
    title: string;
    path: string;
    component: string;
    require_auth: boolean;
    show_user: boolean;
    special_path?: boolean;
    transition?: (outlet: HTMLElement, replace_route: () => void, resume_UI: () => void, is_forward: boolean) => Promise<void>;
    load: () => Promise<void>;
    restrictor?: () => boolean;
};

type route_list = {
    no_auth: route;
    default: route;
    not_found: route;
    $outlet: HTMLElement;
    layout: { [key: string]: route };
};
