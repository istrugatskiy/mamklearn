// Definese the configuration data for particles js and initializes it.
import 'particles.js';

// The config for particles.js
const particle_data = {
    particles: {
        number: {
            value: 25,
            density: {
                enable: true,
                value_area: 1200,
            },
        },
        color: {
            value: '#ffffff',
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000',
            },
            polygon: {
                nb_sides: 5,
            },
            image: {
                src: 'img/github.svg',
                width: 100,
                height: 100,
            },
        },
        opacity: {
            value: 0.5,
            random: true,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false,
            },
        },
        size: {
            value: 10,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false,
            },
        },
        line_linked: {
            enable: false,
            distance: 500,
            color: '#ffffff',
            opacity: 0.4,
            width: 2,
        },
        move: {
            enable: true,
            speed: 10,
            direction: 'bottom',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
            },
        },
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: false,
                mode: 'bubble',
            },
            onclick: {
                enable: false,
                mode: 'repulse',
            },
            resize: true,
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 0.5,
                },
            },
            bubble: {
                distance: 400,
                size: 4,
                duration: 0.3,
                opacity: 1,
                speed: 3,
            },
            repulse: {
                distance: 200,
                duration: 0.4,
            },
            push: {
                particles_nb: 4,
            },
            remove: {
                particles_nb: 2,
            },
        },
    },
    retina_detect: false,
};

// The library requires the config to be a network request, but you can trick it with this scuffedness.
const particle_data_base64 = 'data:text/plain;base64,' + window.btoa(JSON.stringify(particle_data));

/**
 * Initializes the particle library with the mamklearn snow preset.
 */
export const init_particles = () => {
    if (!window.location.href.includes('#performance-mode')) {
        particlesJS.load('particles-js', particle_data_base64);
        document.getElementById('particles-js')!.classList.add('ready');
    }
};
