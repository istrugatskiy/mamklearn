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
