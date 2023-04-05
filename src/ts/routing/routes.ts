import { signInWithRedirect, signOut } from 'firebase/auth';
import { auth, provider } from '../firebase-config';

const home: route = {
    title: 'Home',
    path: '/',
    component: 'home-page',
    require_auth: true,
    show_user: true,
    load: async () => {
        await import('../pages/home.page');
    },
};

const not_found: route = {
    title: 'Not Found',
    path: '/404',
    component: 'not-found-page',
    show_user: false,
    require_auth: false,
    load: async () => {
        await import('../pages/404.page');
    },
};

const no_auth: route = {
    title: 'Mamklearn',
    path: '/no-auth',
    component: 'login-page',
    show_user: false,
    require_auth: false,
    load: async () => {
        await import('../pages/login.page');
    },
};

const privacy_policy: route = {
    title: 'Privacy Policy',
    path: '/privacy-policy',
    component: 'privacy-policy-page',
    require_auth: false,
    show_user: true,
    load: async () => {
        await import('../pages/privacy.page');
    },
};

const login: route = {
    title: 'Login',
    path: '/login',
    component: '[none]',
    require_auth: false,
    show_user: false,
    special_path: true,
    load: async () => {
        signInWithRedirect(auth, provider);
    },
};

const logout: route = {
    title: 'Logout',
    path: '/logout',
    component: '[none]',
    require_auth: false,
    show_user: true,
    special_path: true,
    load: async () => {
        await signOut(auth);
        window.location.pathname = '/';
    },
};

export const routes: route_list = {
    default: home,
    not_found: not_found,
    no_auth: no_auth,
    layout: {
        '/': home,
        '/404': not_found,
        '/no-auth': no_auth,
        '/privacy-policy': privacy_policy,
        '/login': login,
        '/logout': logout,
    },
    $outlet: document.getElementById('outlet')!,
};
