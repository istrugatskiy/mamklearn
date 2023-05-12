import { redirect } from '../router';

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
