import { redirect, start_router, INTERNAL_FOR_TESTING } from '..';

describe('redirect', () => {
    it('should redirect to the given path', () => {
        const path = '/test';
        const spy = jest.spyOn(window.history, 'pushState');
        redirect(path);
        expect(spy).toHaveBeenCalledWith({ index: 1 }, '', path);
    });

    it('should redirect to the given path with a query string', () => {
        const path = '/test?test=1';
        const spy = jest.spyOn(window.history, 'pushState');
        redirect(path);
        expect(spy).toHaveBeenCalledWith({ index: 2 }, '', path);
    });
});

describe('start_router', () => {
    it('should start the router', () => {
        const spy = jest.spyOn(window, 'addEventListener');
        const create_fake_path = (path: string) => {
            return {
                path: `/${path}`,
                component: `${path}-page`,
                title: `${path} page`,
                require_auth: false,
                special_path: false,
                show_user: false,
                load: () => Promise.resolve(),
            };
        };
        const test_route_list: route_list = {
            no_auth: create_fake_path('no-auth'),
            not_found: create_fake_path('not-found'),
            layout: {
                '/': create_fake_path('home'),
                '/test': create_fake_path('test'),
            },
            $outlet: document.createElement('div'),
        };
        start_router(test_route_list);
        expect(INTERNAL_FOR_TESTING.state.routes).toEqual(test_route_list);
        expect(spy).toHaveBeenCalledWith('popstate', expect.any(Function), false);
    });
});
