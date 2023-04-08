import { DragulaOptions, SafeDragulaOptions } from './dragulaTypes';

/**
 * Makes sure all DragulaOptions fields are filled in with the proper placeholder if they're empty.
 *
 * @param {DragulaOptions} options A DragulaOptions object representing the options inputted by a user.
 * @param {(Element[] | undefined)} initialContainers The initial containers to which DragulaJS should register to.
 * @return {SafeDragulaOptions} A DragulaOptions object with all options filled in with either user values or the correct default values.
 */
export const makeOptionsSafe = (initialContainers?: Element[], options?: DragulaOptions): SafeDragulaOptions => {
    // Placeholder functions.
    const always = () => true;
    const never = () => false;
    if (!options && Array.isArray(initialContainers) === false) {
        options = initialContainers as DragulaOptions;
        initialContainers = [];
    }
    if (!options) {
        throw new TypeError('Options are undefined??');
    }
    options.moves ??= always;
    options.accepts ??= always;
    options.invalid ??= never;
    options.containers = (initialContainers as HTMLElement[]) ?? [];
    options.isContainer ??= never;
    options.copy ??= false;
    options.copySortSource ??= false;
    options.revertOnSpill ??= false;
    options.removeOnSpill ??= false;
    options.direction ??= 'vertical';
    options.ignoreInputTextSelection ??= true;
    options.mirrorContainer ??= document.body;
    options.slideFactorX ??= 0;
    options.slideFactorY ??= 0;
    return options as SafeDragulaOptions;
};

/**
 * Returns a value represeting which mouse button triggered it.
 *
 * @param {MouseEvent | TouchEvent} event A MouseEvent or TouchEvent whose mouse button number you wish to check.
 * @return {number} A number representing the mouse button that triggered the event.
 */
export const whichMouseButton = (event: MouseEvent | TouchEvent) => {
    if (event instanceof TouchEvent) {
        return event.touches.length;
    }
    return event.buttons;
};

/**
 * A function which adds or removes listeners for touch / mouse events.
 *
 * @param {HTMLElement} el The element to which you want to register the listener.
 * @param {('add' | 'remove')} op Whether you want to add or remove the listener.
 * @param {('mouseup' | 'mousedown' | 'mousemove')} type The type of event listener (eg. mousedown).
 * @param {(event: MouseEvent) => void} fn The handler function that should be called when the specified event is triggered.
 */
export const touchy = (el: HTMLElement, op: 'add' | 'remove', type: 'mouseup' | 'mousedown' | 'mousemove', fn: (event: MouseEvent) => void) => {
    type eventType = `${typeof op}EventListener`;
    const touch: { [key: string]: string } = {
        mouseup: 'touchend',
        mousedown: 'touchstart',
        mousemove: 'touchmove',
    };
    const pointers: { [key: string]: string } = {
        mouseup: 'pointerup',
        mousedown: 'pointerdown',
        mousemove: 'pointermove',
    };
    if (window.navigator.pointerEnabled) {
        // Have to do type conversion to event because typeScript doesn't know event type.
        el[`${op}EventListener` as eventType](pointers[type], fn as (event: Event) => void);
    } else {
        el[`${op}EventListener` as eventType](touch[type], fn as (event: Event) => void);
        el[`${op}EventListener` as eventType](type, fn as (event: Event) => void);
    }
};

/**
 * Get an elements left and top offset.
 *
 * @param {(HTMLElement | null)} el The element whose offsets you wish to get.
 * @return {leftTopOffsets}  The element's left and top offsets.
 */
export const getOffset = (el: HTMLElement | null) => {
    /**
     * Gets the current scroll position.
     *
     * @param {('scrollLeft' | 'scrollTop')} scrollProp Whether you want to get the scroll left or scroll top offset.
     * @param {('pageXOffset' | 'pageYOffset')} offsetProp Whether you want the page's y or x offset.
     * @return {number} The offset for the specified property.
     */
    const getScroll = (scrollProp: 'scrollLeft' | 'scrollTop', offsetProp: 'pageXOffset' | 'pageYOffset') => {
        if (typeof window[offsetProp] !== 'undefined') {
            return window[offsetProp];
        }
        if (document.documentElement.clientHeight) {
            return document.documentElement[scrollProp];
        }
        return document.body[scrollProp];
    };

    const rect = el?.getBoundingClientRect();
    return {
        left: rect?.left! + getScroll('scrollLeft', 'pageXOffset'),
        top: rect?.top! + getScroll('scrollTop', 'pageYOffset'),
    };
};
