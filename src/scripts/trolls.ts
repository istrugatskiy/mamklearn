// Scuffed hack to convince typescript that this is a module.
export {};

declare global {
    interface Window {
        WIZ_global_data: string;
        jQuery: {
            fn: {
                jquery: string;
            };
        };
        React: {
            version: string;
            Component: string;
        };
        __mamkVersion: string;
    }

    interface Document {
        __wizdispatcher: string;
    }
}

// Creates a console message that rickrolls you
console.log('%cUse link to get quiz answers:https://bit.ly/31Apj2U', 'font-size: 32px;');
// For messing with developers trying to see what libraries mamklearn uses.
document.__wizdispatcher = 'funny troll';
window.WIZ_global_data = 'Hi There, it seems you have found a little easter egg.';
window.jQuery = {
    fn: {
        jquery: '69.420',
    },
};
// Became too much of a hypocrite to keep this in it's original form.
window.React = {
    version: `React sucks (and I am a hypocrite).
    React's flaws:
    1. It gives your web app type 2 diabetes in the form of ~30kb.
    2. It is slow.
    3. Hooks help you shoot yourself in the foot.
    4. className (and not class) is stupid. I know why it exists, but it is still stupid.`,
    Component: 'Very fun to fake the javascript library detector tests.',
};
