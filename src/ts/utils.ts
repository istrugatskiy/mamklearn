/**
 * @license mamkEngine Copyright (c) 2021 Ilya Strugatskiy. All rights reserved.
 */
import { getAuth, signOut } from 'firebase/auth';
import { httpsCallable } from './firebaseFunctionsLite';
let hasLoggedOut = false;
let timerOffset = 0;

/**
 * Gets the numbered id of the inputted string.
 *
 * @param {(Event | string)} inputEvent The input string which should like this 'example12'.
 * @return {string} Returns the numbered id. Given the example above it would return '12'.
 */
export const getID = (inputEvent: Event | string): string => {
    let input = typeof inputEvent === 'string' || inputEvent instanceof String ? inputEvent : (inputEvent.target as HTMLElement).id;
    let inputChars = Array.from(input);
    let output = '';
    for (let i = inputChars.length; i >= 0; i--) {
        if (!Number.isNaN(Number.parseInt(inputChars[i]))) {
            output = inputChars[i] + output;
        }
    }
    return output;
};

/**
 * Returns a reference to the first object with the specified value of the ID attribute.
 *
 * @param {string} a String that specifies the ID value.
 * @return {HTMLElement} Reference to the first object with the specified value of the ID attribute.
 */
export const $ = (a: string): HTMLElement => {
    return document.getElementById(a)!;
};

/**
 * Returns the ordinal suffix given a specified number.
 *
 * @param {number} i The number specified.
 * @return {('st' | 'nd' | 'rd' | 'th')} The ordinal suffix that would accompany the number specified.
 */
export const ordinalSuffix = (i: number): 'st' | 'nd' | 'rd' | 'th' => {
    let mod10 = i % 10;
    let mod100 = i % 100;
    if (mod10 == 1 && mod100 != 11) {
        return 'st';
    }
    if (mod10 == 2 && mod100 != 12) {
        return 'nd';
    }
    if (mod10 == 3 && mod100 != 13) {
        return 'rd';
    }
    return 'th';
};

/**
 * Clamps a number between two values.
 *
 * @param {number} num The number to clamp.
 * @param {number} min The minimum value that the number can be.
 * @param {number} max The maximum value the number can be.
 * @return {number} The number clamped between the two specified values.
 */
export const mathClamp = (num: number, min: number, max: number): number => {
    return num <= min ? min : num >= max ? max : num;
};

/**
 * Gets the character offset of the specified element.
 *
 * @param {HTMLElement} element The element for which to get the character offset.
 * @return {number} The character offset of the specified element.
 */
export const getCaretCharacterOffsetWithin = (element: HTMLElement): number => {
    let caretOffset = 0;
    const doc = element.ownerDocument;
    const win = doc.defaultView!;
    const sel = win.getSelection();
    if (sel!.rangeCount > 0) {
        let range = win.getSelection()!.getRangeAt(0);
        let preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
};

/**
 * Updates the character count UI with new values.
 *
 * @param {Element} element The element that needs to be update.
 * @param {(string | null)} total The total characters allowed for the field.
 */
export const characterCount = (element: Element, total: string | null) => {
    element.nextElementSibling!.textContent = `${element.textContent!.length}/${total}`;
};

/**
 * Checks if two objects are equal.
 *
 * @param {*} object1 The first object.
 * @param {*} object2 The second object.
 * @return {boolean} Whether the two objects are equal.
 */
export const deepEqual = (object1: any, object2: any): boolean => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    const isObject = (object: object) => {
        return object != null && typeof object === 'object';
    };

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
            return false;
        }
    }

    return true;
};

/**
 * Renders a template to specified location.
 *
 * @param {string} templateID The template's ID.
 * @param {string} place The ID of the element to which you want to append the template.
 * @param {(boolean | string | null)} [modifID=false] The name of the string you want to replace in the elements id.
 * @param {(boolean | number | null)} [replace=false] The new string to put in the old string's place.
 */
export const createTemplate = (templateID: string, place: string, modifID: boolean | string | null = false, replace: boolean | number | null = false) => {
    let content = ($(templateID) as HTMLTemplateElement).content.cloneNode(true) as HTMLElement;
    if (modifID !== null) {
        content.querySelectorAll('[id]').forEach((element) => {
            element.id = element.id.replace(modifID.toString(), replace!.toString());
        });
    }
    $(place).appendChild(content);
};

/**
 * Sets the main title screen with a new template.
 *
 * @param {string} templateID The ID of the new template.
 */
export const setTitle = (templateID: string) => {
    $('title').replaceChildren();
    createTemplate(templateID, 'title');
};

/**
 * Shows the user an error message and logs debug information.
 *
 * @param {string} msg The message that you want to pass.
 */
export const throwExcept = (msg: string) => {
    // Prevents false positive errors
    if (hasLoggedOut) return;
    $('commError2').style.display = 'block';
    $('CommError').style.display = 'block';
    $('comError3').textContent = msg;
    console.trace(msg);
};

/**
 * Sets the caret position in an element to the specified offset.
 *
 * @param {HTMLElement} element The element whose caret position to set.
 * @param {number} offset The offset, the larger the farther left the cursor will be.
 */
export const setCaretPosition = (element: HTMLElement, offset: number) => {
    let range = document.createRange();
    let sel = window.getSelection();

    // Select appropriate node
    let currentNode: Node | null = null;
    let previousNode = null;

    for (let i = 0; i < element.childNodes.length; i++) {
        // Save previous node
        previousNode = currentNode;

        // Get current node
        currentNode = element.childNodes[i];
        // If we get span or something else then we should get child node
        while (currentNode.childNodes.length > 0) {
            currentNode = currentNode.childNodes[0];
        }

        // Calc offset in current node
        if (previousNode != null) {
            offset -= (previousNode as unknown as NodeListOf<ChildNode>).length;
        }
        // Check whether current node has enough length
        if (offset <= (currentNode as unknown as NodeListOf<ChildNode>).length) {
            break;
        }
    }
    // Move caret to specified offset
    if (currentNode != null) {
        range.setStart(currentNode, offset);
        range.collapse(true);
        sel!.removeAllRanges();
        sel!.addRange(range);
    }
};

/**
 * Logs the user out and reloads the page.
 */
export const logOut = () => {
    const auth = getAuth();
    signOut(auth)
        .then(() => {
            hasLoggedOut = true;
            window.location.reload();
        })
        .catch((error) => {
            throwExcept(`@LogOut: ${error}`);
        });
};

/**
 * Linearly interpolates between {@link x} and {@link y} by {@link a}
 *
 * @param {number} x The initial value.
 * @param {number} y The new value.
 * @param {number} a The interpolation value.
 */
export const mathLerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

/**
 * Dynamically imports a chonk and calls the specified callback.
 *
 * @param {string} chonkToLoad The name of the chonk that you want to load.
 * @param {(returnedObject: any) => void} callback The callback called on success.
 */
export const loadChonk = (chonkToLoad: string, callback: (returnedObject: any) => void) => {
    import(`./${chonkToLoad}`)
        .then((obj) => {
            callback(obj);
        })
        .catch((error) => {
            console.warn(`Failed to fetch chonk (${error})! Retrying...`);
            setTimeout(() => {
                loadChonk(chonkToLoad, callback);
            }, 2000);
        });
};

/**
 * A helpful utility for managing multiple audio tracks.
 *
 * @class AudioManager
 */
export class AudioManager {
    private audioObjects: { [key: string]: { source: string; index: number | null } } = {};
    private currentlyPlaying: HTMLMediaElement[] = [];
    private errors = {
        trackNotDefined: 'The audio track you attempted to play is not defined!',
        trackNotPlayed: 'You need to play the track before modifying it!',
    };

    /**
     * Creates an instance of AudioManager.
     *
     * @param {{ [name: string]: string }} audioObjects A key value pair of the name by which you want to reference the audio track and its actual location.
     * @memberof AudioManager
     */
    constructor(audioObjects: { [name: string]: string }) {
        Object.entries(audioObjects).forEach(([key, value]) => {
            this.audioObjects[key] = {
                source: value,
                index: null,
            };
        });
    }

    /**
     * Plays the specified audio track.
     *
     * @param {string} name The name of the track you want to load.
     * @param {boolean} [shouldLoop=false] Whether the track should loop.
     * @param {number} [volume=1] The starting volume of the track.
     * @memberof AudioManager
     */
    play(name: string, shouldLoop: boolean = false, volume: number = 1) {
        if (this.audioObjects[name]) {
            let newAudio = new Audio(this.audioObjects[name].source);
            newAudio.loop = shouldLoop;
            newAudio.volume = volume;
            newAudio.play();
            this.audioObjects[name].index = this.currentlyPlaying.push(newAudio) - 1;
        } else {
            this.raiseException('trackNotDefined');
        }
    }

    /**
     * Interpolates between the current volume of the specified track and the new volume.
     *
     * @param {string} name The name of the track you want to modify.
     * @param {number} newVolume The new volume.
     * @param {boolean} [noInterpolate=false] Disable volume interpolation
     * @memberof AudioManager
     */
    setVolume(name: string, newVolume: number, noInterpolate: boolean = false) {
        if (this.audioObjects[name].index !== null) {
            const currentAudio = this.currentlyPlaying[this.audioObjects[name].index!];
            if (noInterpolate) {
                currentAudio.volume = newVolume;
            } else {
                this.lerper(currentAudio, newVolume, 'volume', 1);
            }
        } else {
            this.raiseException('trackNotPlayed');
        }
    }

    /**
     * Interpolates between the current speed of the specified track and the new speed.
     *
     * @param {string} name The name of the track you want to modify.
     * @param {number} newSpeed The new speed.
     * @memberof AudioManager
     */
    setSpeed(name: string, newSpeed: number) {
        if (this.audioObjects[name].index !== null) {
            const currentAudio = this.currentlyPlaying[this.audioObjects[name].index!];
            this.lerper(currentAudio, newSpeed, 'playbackRate', 10);
        } else {
            this.raiseException('trackNotPlayed');
        }
    }

    /**
     * Stops all currently playing tracks and resets the object.
     *
     * @memberof AudioManager
     */
    clearAll() {
        this.currentlyPlaying.forEach((audioTrack) => {
            audioTrack.pause();
        });
        this.currentlyPlaying = [];
        this.audioObjects = {};
    }

    /**
     * Handles lerping for HTMLMedia element properties.
     *
     * @private
     * @param {HTMLMediaElement} currentAudio The HTMLMediaElement you wish to perform the operation on.
     * @param {number} newValue The new value of the property.
     * @param {('playbackRate' | 'volume')} prop The property whose value you wish to interpolate.
     * @param {number} maxValue The maximum value of the potential prop.
     * @memberof AudioManager
     */
    private lerper(currentAudio: HTMLMediaElement, newValue: number, prop: 'playbackRate' | 'volume', maxValue: number) {
        let distance = 0;
        const initValue = currentAudio[prop];
        const interval = window.setInterval(() => {
            if (currentAudio[prop] >= newValue && initValue - newValue < 0) {
                clearInterval(interval);
            } else if (currentAudio[prop] <= newValue && initValue - newValue > 0) {
                clearInterval(interval);
            } else {
                distance += 0.05;
                currentAudio[prop] = mathClamp(mathLerp(initValue, newValue, distance), 0, maxValue);
            }
        }, 100);
    }

    /**
     * Throws a new TypeError with a specified error message.
     *
     * @private
     * @param {('trackNotPlayed' | 'trackNotDefined')} input The type of error message you wish to pass.
     * @memberof AudioManager
     */
    private raiseException(input: 'trackNotPlayed' | 'trackNotDefined') {
        throw new TypeError(this.errors[input]);
    }
}

/**
 * Downloads a file to a users device.
 *
 * @param {string} filename The name that you wish to give to the file.
 * @param {string} text The data that you want to be placed in the file.
 */
export const download = (filename: string, text: string) => {
    const el = document.createElement('a');
    el.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    el.setAttribute('download', filename);
    el.click();
};

/**
 * Takes a function as an argument and runs it if it isn't null.
 *
 * @param {() => any} inputFunction The function to input.
 */
export const call = (inputFunction: unknown) => {
    !(inputFunction && typeof inputFunction === 'function') || inputFunction();
};

/**
 * Initializes the time handler in the background.
 */
export const timeHandler = async () => {
    httpsCallable('timeSync')()
        .then(({ data }) => {
            timerOffset = data.message <= Date.now() ? Date.now() - data.message : data.message - Date.now();
        })
        .catch(() => {
            setTimeout(() => {
                timeHandler();
            }, 4000);
        });
};

/**
 * Returns the current server date.
 *
 * @return {number} This returns the current server date, or if unavailable the current date.
 */
export const getCurrentDate = () => {
    return Date.now() + timerOffset;
};
