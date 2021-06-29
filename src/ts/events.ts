import { characterCount, getCaretCharacterOffsetWithin, setCaretPosition, throwExcept } from './utils';

/**
 * Initiliiazes the event handling Library.
 */
export const eventHandle = () => {
    // Attaches a click listener that handles click events and clickIncludesEvents
    window.addEventListener('click', (event) => {
        const eventTarget = (event.target! as HTMLElement).id;
        if (eventTarget in window.clickEvents) {
            window.clickEvents[eventTarget](event);
        }
        for (const [key, value] of Object.entries(window.clickIncludesEvents)) {
            if (eventTarget.includes(key)) {
                value(event);
                break;
            }
        }
    });
    // Attaches keydown for handling spacebar and enter input.
    window.addEventListener('keydown', (event) => {
        if (event.key == 'Enter' || event.key == ' ') {
            const eventTarget = (event.target! as HTMLElement).id;
            for (const [key, value] of Object.entries(window.keyboardIncludesEvents)) {
                if (eventTarget.includes(key)) {
                    value(event);
                    break;
                }
            }
        }
    });
    // Attaches submit listener for handling submit events.
    window.addEventListener('submit', function (event) {
        event.preventDefault();
        const eventTarget = (event.target! as HTMLElement).id;
        if (eventTarget in window.submitEvents) {
            window.submitEvents[eventTarget](event);
        }
    });
    // Attaches event listener for dealing with all contenteditable.
    window.addEventListener('input', (event) => {
        const target = event.target! as HTMLElement;
        if (target.matches('[contenteditable]')) {
            let characterOffset = getCaretCharacterOffsetWithin(target);
            const maxLength = Number.parseInt(target.dataset.maxlength!);
            target.textContent = String(target.textContent!.replace(/(\r\n|\r|\n)/, ''));
            if (maxLength < target.textContent!.length) {
                target.textContent = target.dataset.revert as string;
                setCaretPosition(target, characterOffset - 1);
            } else {
                setCaretPosition(target, characterOffset);
            }
            characterCount(target, target.dataset.maxlength as string);
        }
    });
    // This is to prevent weirdnesses with contenteditable.
    window.addEventListener('beforeinput', (event) => {
        const target = event.target! as HTMLElement;
        if ((event.target! as HTMLElement).matches('[contenteditable]')) {
            target.dataset.revert = target.textContent as string;
        }
    });
    // Shows error message if error is encountered.
    window.addEventListener('error', (error) => {
        throwExcept('@ScriptErrorHandler: ' + error.message);
    });
};
