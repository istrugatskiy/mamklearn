import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { base_content } from '../templates/base-content.lit';

/**
 * A button component.
 * @element mamk-button
 * @slot - The button's content.
 */
@customElement('mamk-button')
export class mamk_button extends base_content {
    halt_UI = () => {
        this.disabled = true;
    };
    resume_UI = () => {
        this.disabled = false;
    };

    render() {
        return html`<button class="button"><slot></slot></button>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mamk-button': mamk_button;
    }
}
