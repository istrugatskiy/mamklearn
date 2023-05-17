import { signInWithRedirect, signOut } from 'firebase/auth';
import { auth, provider } from '../scripts/firebase-config';
import { redirect } from './router';

const home: route = {
    title: 'My Style',
    path: '/',
    component: 'my-style-page',
    require_auth: true,
    show_user: true,
    icon: 'styler',
    load: async () => {
        await import('../pages/my-style.page');
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
    title: 'Not Authenticated',
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
    show_user: false,
    icon: 'privacy_tip',
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
        redirect('/');
        await signInWithRedirect(auth, provider);
    },
};

const logout: route = {
    title: 'Logout',
    path: '/logout',
    component: '[none]',
    require_auth: false,
    show_user: true,
    special_path: true,
    icon: 'logout',
    load: async () => {
        await signOut(auth);
        window.location.href = `/${window.location.search}`;
    },
};

const terms_of_service: route = {
    title: 'Terms of Service',
    path: '/terms-of-service',
    component: 'terms-of-service-page',
    require_auth: false,
    show_user: false,
    load: async () => {
        await import('../pages/terms.page');
    },
};

const about: route = {
    title: 'About',
    path: '/about',
    component: 'about-page',
    require_auth: false,
    show_user: false,
    icon: 'info',
    load: async () => {
        await import('../pages/about.page');
    },
};

const play: route = {
    title: 'Play',
    path: '/play',
    icon: 'play_arrow',
    component: 'play-page',
    require_auth: true,
    show_user: true,
    load: async () => {
        await import('../pages/play.page');
    },
};

const my_quizzes: route = {
    title: 'My Quizzes',
    path: '/my-quizzes',
    icon: 'quiz',
    component: 'my-quizzes-page',
    require_auth: true,
    show_user: true,
    load: async () => {
        await import('../pages/my-quizzes.page');
    },
};

export const routes: route_list = {
    not_found: not_found,
    no_auth: no_auth,
    layout: {
        '/': home,
        '/404': not_found,
        '/no-auth': no_auth,
        '/play': play,
        '/my-quizzes': my_quizzes,
        '/about': about,
        '/privacy-policy': privacy_policy,
        '/terms-of-service': terms_of_service,
        '/login': login,
        '/logout': logout,
    },
    $outlet: document.getElementById('outlet'),
};
