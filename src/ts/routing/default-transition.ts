import { sleep } from '../utils';

export const default_transition = async (outlet: HTMLElement, replace_route: () => void, resume_UI: () => void, is_forward: boolean) => {
    const first_transition = `slide-${is_forward ? 'right' : 'left'}-out`;
    const second_transition = `slide-${is_forward ? 'left' : 'right'}-in`;
    outlet.classList.add(first_transition);
    await sleep(400);
    replace_route();
    outlet.classList.remove(first_transition);
    outlet.classList.add(second_transition);
    await sleep(400);
    outlet.classList.remove(second_transition);
    resume_UI();
};
