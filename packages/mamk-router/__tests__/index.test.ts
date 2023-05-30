import { sleep } from '@istrugatskiy/mamk-utils';
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
            title: 'Support',
            icon: 'support',
            component: 'support-page',
            require_auth: true,
            load: () => Promise.resolve(),
        },
        '/bad': {
            title: 'Bad',
            icon: 'bad',
            component: 'bad-page',
            require_auth: true,
            load: async () => {
                throw new Error('Bad page');
            },
        },
    },
    $outlet: document.createElement('div'),
};

describe('router', () => {
    const email = 'ilya@mamklearn.com';

    describe('constructor', () => {
        it('should add a popstate event listener', () => {
            const spy = jest.spyOn(window, 'addEventListener');
            new router(fake_router, ['mamklearn.com'], ['terrydavis@templeos.org']);
            expect(spy).toHaveBeenCalledWith('popstate', expect.any(Function), false);
            spy.mockRestore();
        });

        const r = new router(fake_router, ['mamklearn.com'], [email]);

        it('should set the routes', () => {
            expect(r.routes).toEqual(fake_router);
        });

        it('should set the email domains', () => {
            expect(r.email_domains).toEqual(['mamklearn.com']);
        });

        it('should set the admins', () => {
            expect(r.admins).toEqual([email]);
        });
    });

    describe('on_auth_changed', () => {
        const r = new router(fake_router, ['mamklearn.com'], [email]);

        it('should set the ready state', () => {
            const r2 = new router(fake_router, ['mamklearn.com'], [email]);
            expect(r2.is_ready).toBe(false);
            r2.on_auth_changed(email);
            expect(r2.is_ready).toBe(true);
        });

        it('should set the signed in state', () => {
            r.on_auth_changed(email);
            expect(r.is_signed_in).toBe(true);
            r.on_auth_changed(null);
            expect(r.is_signed_in).toBe(false);
        });

        it('in the event of an invalid email domain should redirect to /logout?invalid_email=true&email_ending={{encoded_uri_email_ending}}', () => {
            const spy = jest.spyOn(r, 'redirect');
            r.on_auth_changed('bad_actor@nsa.gov');
            expect(spy).toHaveBeenCalledWith('/logout?invalid_email=true&email_ending=nsa.gov');
            spy.mockRestore();
        });

        it('should use the /no-auth component if the user is not signed in', async () => {
            await sleep(1000);
            r.redirect('/');
            await sleep(1000);
            const spy = jest.spyOn(document, 'createElement');
            r.on_auth_changed(null);
            await sleep(1000);
            expect(spy).toHaveBeenCalledWith('login-page');
            spy.mockRestore();
        });
    });

    describe('redirect', () => {
        const r = new router(fake_router, ['gmail.com'], [email]);
        r.on_auth_changed(email);

        it('should broadcast a mamk-route-change custom event', async () => {
            await sleep(100);
            const spy = jest.spyOn(window, 'dispatchEvent');
            r.redirect('/Downloads');
            // Have to give enough of a delay.
            await sleep(1000);
            expect(spy).toHaveBeenCalledWith(new CustomEvent('mamk-route-change', { detail: '/404' }));
            spy.mockRestore();
        });

        it('should replace the current state if the path is the same', async () => {
            const spy = jest.spyOn(window.history, 'replaceState');
            r.redirect('/Downloads');
            await sleep(100);
            expect(spy).toHaveBeenCalledWith({ index: 1 }, '', '/Downloads');
            spy.mockRestore();
        });

        it('should throw on any javascript urls', () => {
            expect(() => r.redirect('javascript:alert(1)')).toThrow();
        });

        it('should open a new tab for external urls', () => {
            const spy = jest.spyOn(window, 'open').mockImplementation(() => null);
            r.redirect('https://mamklearn.com');
            expect(spy).toHaveBeenCalledWith('https://mamklearn.com', '_blank', 'noopener noreferrer');
            spy.mockRestore();
        });

        it('should console.error when the load function throws', async () => {
            const spy = jest.spyOn(console, 'error').mockImplementation(() => null);
            r.redirect('/bad');
            await sleep(100);
            expect(spy).toHaveBeenCalledWith(expect.any(Error));
            spy.mockRestore();
        });
    });
});
