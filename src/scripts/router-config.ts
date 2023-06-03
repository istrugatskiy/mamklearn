import { signInWithRedirect, signOut } from 'firebase/auth';
import { router } from '@istrugatskiy/mamk-router';
import { auth, provider } from '@istrugatskiy/mamk-firewrap';
import { valid_email_domains, admins } from '/mamk-config.yaml';

const not_found: route = {
    title: 'Not Found',
    component: 'not-found-page',
    load: () => import('../pages/404.page'),
};

const no_auth: route = {
    title: 'Not Authenticated',
    component: 'login-page',
    load: () => import('../pages/login.page'),
};

const routes: route_list = {
    not_found: not_found,
    no_auth: no_auth,
    layout: {
        '/': {
            title: 'My Style',
            component: 'my-style-page',
            require_auth: true,
            icon: 'styler',
            load: () => import('../pages/my-style.page'),
        },
        '/404': not_found,
        '/no-auth': no_auth,
        '/play': {
            title: 'Play',
            icon: 'play_arrow',
            component: 'play-page',
            require_auth: true,
            load: () => import('../pages/play.page'),
        },
        '/my-quizzes': {
            title: 'My Quizzes',
            icon: 'quiz',
            component: 'my-quizzes-page',
            require_auth: true,
            load: () => import('../pages/my-quizzes.page'),
        },
        '/about': {
            title: 'About',
            component: 'about-page',
            icon: 'info',
            load: () => import('../pages/about.page'),
        },
        '/privacy-policy': {
            title: 'Privacy Policy',
            component: 'privacy-policy-page',
            icon: 'privacy_tip',
            load: () => import('../pages/privacy.page'),
        },
        '/terms-of-service': {
            title: 'Terms of Service',
            component: 'terms-of-service-page',
            icon: 'gavel',
            load: () => import('../pages/terms.page'),
        },
        '/login': {
            title: 'Login',
            component: '[none]',
            special_path: true,
            load: async (redirect) => {
                redirect('/');
                await signInWithRedirect(auth, provider);
            },
        },
        '/logout': {
            title: 'Logout',
            component: '[none]',
            special_path: true,
            icon: 'logout',
            load: async () => {
                await signOut(auth);
                window.location.href = `/${window.location.search}`;
            },
        },
    },
};

/**
 * The global router instance.
 */
const router_instance = new router(routes, valid_email_domains, admins);

export default router_instance;
