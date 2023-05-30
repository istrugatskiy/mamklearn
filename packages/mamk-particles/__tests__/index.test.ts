import { tsParticles } from 'tsparticles-engine';
import { init_particles } from '..';

describe('init_particles', () => {
    beforeAll(() => {
        window.location.hash = '';
        const div = document.createElement('div');
        div.id = 'particles-js';
        document.body.appendChild(div);
    });

    it("shouldn't throw", () => {
        expect(async () => await init_particles()).not.toThrow();
    });

    it("shouldn't load particles if #performance-mode is set", async () => {
        const spy = jest.spyOn(tsParticles, 'load').mockImplementation(() => Promise.resolve(undefined));
        window.location.hash = '#performance-mode';
        await init_particles();
        expect(spy).not.toHaveBeenCalled();
        spy.mockRestore();
    });

    it('should load particles if #performance-mode is not set', async () => {
        const spy = jest.spyOn(tsParticles, 'load').mockImplementation(() => Promise.resolve(undefined));
        window.location.hash = '';
        await init_particles();
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
    });

    it('should throw if the particles-js element is not found', async () => {
        const spy = jest.spyOn(tsParticles, 'load').mockImplementation(() => Promise.resolve(undefined));
        const div = document.getElementById('particles-js');
        if (div) {
            div.remove();
        }
        await expect(init_particles()).rejects.toThrow();
        spy.mockRestore();
    });
});
