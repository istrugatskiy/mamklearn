import { default_transition } from '../default-transition';

describe('default-transition', () => {
    const replace_route = jest.fn();
    const resume_ui = jest.fn();

    it('should return a promise', () => {
        const outlet = document.createElement('div');
        const result = default_transition(outlet, replace_route, resume_ui, true);
        expect(result).toBeInstanceOf(Promise);
    });

    it('should call replace_route', async () => {
        const outlet = document.createElement('div');
        await default_transition(outlet, replace_route, resume_ui, true);
        expect(replace_route).toHaveBeenCalled();
    });

    it('should call resume_ui', async () => {
        const outlet = document.createElement('div');
        await default_transition(outlet, replace_route, resume_ui, true);
        expect(resume_ui).toHaveBeenCalled();
    });

    it('should add first_transition class to outlet and remove it', async () => {
        const outlet = document.createElement('div');
        await default_transition(outlet, replace_route, resume_ui, true);
        expect(outlet.classList.contains('slide-right-out')).toBeFalsy();
    });

    it('should account for is_forward', async () => {
        const outlet = document.createElement('div');
        default_transition(outlet, replace_route, resume_ui, false);
        expect(outlet.classList.contains('slide-left-out')).toBeTruthy();
    });
});
