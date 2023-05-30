import { sleep } from '@istrugatskiy/mamk-utils';

/**
 * The default slide in/out transition.
 * @param outlet - The outlet to transition.
 * @param replace_route - The function to call to replace outlet contents.
 * @param resume_ui - The function to call to resume the UI.
 * @param is_forward - Whether the transition is forward or backward.
 */
export const default_transition = async (outlet: HTMLElement, replace_route: () => void, resume_ui: () => void, is_forward: boolean) => {
    const first_transition = `slide-${is_forward ? 'right' : 'left'}-out`;
    const second_transition = `slide-${is_forward ? 'right' : 'left'}-in`;
    outlet.classList.add(first_transition);
    await sleep(300);
    replace_route();
    outlet.classList.remove(first_transition);
    outlet.classList.add(second_transition);
    await sleep(300);
    outlet.classList.remove(second_transition);
    resume_ui();
};
