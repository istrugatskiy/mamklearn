import { characterCount, getCaretCharacterOffsetWithin, setCaretPosition, throwExcept } from './utils';

// Handles the majority of events.
export const eventHandle = () => {
    window.addEventListener('click', (event) => {
        const keys = Object.keys(window.clickIncludesEvents);
        const eventTarget = (event.target! as HTMLElement).id;
        if (eventTarget in window.clickEvents) {
            window.clickEvents[eventTarget](event);
        }
        for (let i = 0; i < keys.length; i++) {
            if (eventTarget.includes(keys[i])) {
                window.clickIncludesEvents[keys[i]](event);
                break;
            }
        }
    });
    window.addEventListener('keydown', (event) => {
        if (event.key == 'Enter' || event.key == ' ') {
            const keys = Object.keys(window.keyboardIncludesEvents);
            const eventTarget = (event.target! as HTMLElement).id;
            for (let i = 0; i < keys.length; i++) {
                if (eventTarget.includes(keys[i])) {
                    window.keyboardIncludesEvents[keys[i]](event);
                    break;
                }
            }
        }
    });
    window.addEventListener('submit', function (event) {
        event.preventDefault();
        const eventTarget = (event.target! as HTMLElement).id;
        if (eventTarget in window.submitEvents) {
            window.submitEvents[eventTarget](event);
        }
    });
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
    window.addEventListener('beforeinput', (event) => {
        const target = event.target! as HTMLElement;
        if ((event.target! as HTMLElement).matches('[contenteditable]')) {
            target.dataset.revert = target.textContent as string;
        }
    });
    window.addEventListener('error', (error) => {
        throwExcept('@ScriptErrorHandler: ' + error.message);
    });
};
