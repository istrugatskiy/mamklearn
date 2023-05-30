import { router } from '..';

const not_found: route = {
    title: 'Not Found',
    component: 'not-found-page',
    require_auth: false,
    load: () => Promise.resolve(),
};

const no_auth: route = {
    title: 'Not Authenticated',
    component: 'login-page',
    require_auth: false,
    load: () => Promise.resolve(),
};

// Reference: https://templeos.org/
const fake_router: route_list = {
    not_found: not_found,
    no_auth: no_auth,
    layout: {
        '/': {
            title: 'TempleOS',
            component: 'home-page',
            require_auth: true,
            icon: 'templeos',
            load: () => Promise.resolve(),
        },
        '/404': not_found,
        '/no-auth': no_auth,
        '/Downloads': {
            title: 'Downloads',
            icon: 'download',
            component: 'downloads-page',
            require_auth: false,
            load: () => Promise.resolve(),
        },
        '/support.html': {
            title: 'My Quizzes',
            icon: 'support',
            component: 'support-page',
            require_auth: true,
            load: () => Promise.resolve(),
        },
    },
    $outlet: document.getElementById('outlet'),
};

describe('router', () => {
    describe('constructor', () => {
        it('should create a router', () => {
            expect(router).toBeDefined();
        });
    });
});
