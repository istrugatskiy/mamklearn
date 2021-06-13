// These are some helper functions used throughout the app!
import { getAuth, signOut } from 'firebase/auth';
let hasLoggedOut = false;
let errorCount = 0;

export const getID = (inputEvent: Event | string) => {
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

export const $ = (a: string): HTMLElement => {
    return document.getElementById(a)!;
};

// Thanks stackoverflow lol
export const ordinalSuffix = (i: number) => {
    let j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return 'st';
    }
    if (j == 2 && k != 12) {
        return 'nd';
    }
    if (j == 3 && k != 13) {
        return 'rd';
    }
    return 'th';
};

export const clearChildren = (element: string) => {
    while ($(element).firstChild) $(element).removeChild($(element).lastChild!);
};

export const mathClamp = (num: number, min: number, max: number) => {
    return num <= min ? min : num >= max ? max : num;
};

export const getCaretCharacterOffsetWithin = (element: HTMLElement) => {
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

export const characterCount = (thisVar: Element, total: string | null) => {
    thisVar.nextElementSibling!.textContent = `${thisVar.textContent!.length}/${total}`;
};

export const deepEqual = (object1: any, object2: any) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);

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

export const isObject = (object: object) => {
    return object != null && typeof object === 'object';
};

// Creates object from template!
// Uniqifies the id's if specified.
export const createTemplate = (templateID: string, place: string, modifID: boolean | string | null = false, replace: boolean | number | null = false) => {
    let content = ($(templateID) as HTMLTemplateElement).content.cloneNode(true) as HTMLElement;
    if (modifID !== null) {
        content.querySelectorAll('[id]').forEach((element) => {
            element.id = element.id.replace(modifID.toString(), replace!.toString());
        });
    }
    $(place).appendChild(content);
};

export const setTitle = (templateID: string) => {
    clearChildren('title');
    createTemplate(templateID, 'title');
};

export const throwExcept = (msg: string) => {
    // Prevents false positive errors
    if (hasLoggedOut) return;
    $('commError2').style.display = 'block';
    $('CommError').style.display = 'block';
    $('comError3').textContent = msg;
    console.trace(msg);
};

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

export const mathLerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

export const loadChonk = (chonkToLoad: string, callback: (returnedObject: any) => void) => {
    import(`./${chonkToLoad}`)
        .then((obj) => {
            callback(obj);
        })
        .catch((error) => {
            errorCount++;
            if (errorCount < 15) {
                setTimeout(() => {
                    console.warn(`Failed to fetch chonk (${error})! Retrying...`);
                    loadChonk(chonkToLoad, callback);
                }, 2000);
            } else {
                throwExcept(`@LoadChonk: ${error}`);
            }
        });
};

// Demo of what the mamklearn codebase COULD be like, like I'll ever bother using classes
export class AudioManager {
    private audioObjects: { [key: string]: { source: string; index: number | null } } = {};
    private currentlyPlaying: HTMLMediaElement[] = [];

    constructor(audioObjects: { [name: string]: string }) {
        Object.entries(audioObjects).forEach(([key, value]) => {
            this.audioObjects[key] = {
                source: value,
                index: null,
            };
        });
    }

    play(name: string, shouldLoop: boolean = false, volume: number = 1) {
        if (this.audioObjects[name]) {
            let newAudio = new Audio(this.audioObjects[name].source);
            newAudio.loop = shouldLoop;
            newAudio.volume = volume;
            newAudio.play();
            this.audioObjects[name].index = this.currentlyPlaying.push(newAudio) - 1;
        } else {
            throw new TypeError('The audio clip you attempted to play is not defined!');
        }
    }

    setVolume(name: string, newVolume: number, noInterpolate: boolean = false) {
        if (this.audioObjects[name].index !== null) {
            const currentAudio = this.currentlyPlaying[this.audioObjects[name].index!];
            let distance = 0;
            let initVolume = currentAudio.volume;
            if (noInterpolate) {
                currentAudio.volume = newVolume;
            } else {
                const interval = window.setInterval(() => {
                    if (currentAudio.volume >= newVolume && initVolume - newVolume < 0) {
                        clearInterval(interval);
                    } else if (currentAudio.volume <= newVolume && initVolume - newVolume > 0) {
                        clearInterval(interval);
                    } else {
                        distance += 0.05;
                        currentAudio.volume = mathClamp(mathLerp(initVolume, newVolume, distance), 0, 1);
                    }
                }, 100);
            }
        } else {
            throw new TypeError('You need to play the clip before modifying it!');
        }
    }

    setSpeed(name: string, newSpeed: number) {
        if (this.audioObjects[name].index !== null) {
            const currentAudio = this.currentlyPlaying[this.audioObjects[name].index!];
            let distance = 0;
            let initVolume = currentAudio.playbackRate;
            const interval = window.setInterval(() => {
                if (currentAudio.playbackRate >= newSpeed && initVolume - newSpeed < 0) {
                    clearInterval(interval);
                } else if (currentAudio.playbackRate <= newSpeed && initVolume - newSpeed > 0) {
                    clearInterval(interval);
                } else {
                    distance += 0.05;
                    currentAudio.playbackRate = mathClamp(mathLerp(initVolume, newSpeed, distance), 0, 10);
                }
            }, 100);
        } else {
            throw new TypeError('You need to play the clip before modifying it!');
        }
    }

    clearAll() {
        this.currentlyPlaying.forEach((audioClip) => {
            audioClip.pause();
        });
        this.currentlyPlaying = [];
        this.audioObjects = {};
    }
}

export const download = (filename: string, text: string) => {
    const pom = document.createElement('a');
    pom.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
};
