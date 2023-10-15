import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * A text input element for use with forms.
 * @element mamk-text-input
 */
@customElement('mamk-text-input')
export class mamk_text_input extends LitElement {
    static styles = [
        css`
            h1 {
                font-size: 32px;
                color: white;
                font-family: 'Chelsea Market', cursive;
                text-align: center;
                height: min-content;
            }
        `,
    ];

    protected render() {
        return html`<h1><slot></slot></h1>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mamk-text-input': mamk_text_input;
    }
}
