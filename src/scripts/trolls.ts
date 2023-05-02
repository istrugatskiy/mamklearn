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
window.React = {
    version: `React and all the other major libraries are garbage. There are some excpetions like lit or Preact which mitigate some of my concerns but no library is perfect.
    React's flaws:
    1. It gives your web app type 2 diabetes in the form of 90kb.
    2. It literally puts HTML in JS and libraries like styledComponents make it even worse. The entire idea is to separate stuff into multiple files, something that Angular does sometimes.
    3. It renders everything at once and doesn't allow for lazy loading parts of the site, you need the entirety of react to start rendering.
    4. It isn't as fast as native dom operations.`,
    Component: 'Very fun to fake the javascript library detector tests.',
};
