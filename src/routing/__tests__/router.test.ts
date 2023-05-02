import { redirect } from '../router';

describe('redirect', () => {
    it('should redirect to the given path', () => {
        const path = '/test';
        const spy = jest.spyOn(window.history, 'pushState');
        redirect(path);
        expect(spy).toHaveBeenCalledWith({ index: 0 }, '', path);
    });
});
