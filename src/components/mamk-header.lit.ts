import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * A header element that is styled for use on the mamklearn website.
 * @element mamk-header
 * @slot The content of the header.
 */
@customElement('mamk-header')
export class mamk_header extends LitElement {
    static styles = [
        css`
            h1 {
                font-size: 42px;
                color: white;
                font-family: 'Chelsea Market', cursive;
                text-align: center;
                height: min-content;
            }
            @media screen and (max-width: 900px) {
                h1 {
                    font-size: 32px;
                }
            }
        `,
    ];

    protected render() {
        return html`<h1><slot></slot></h1>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mamk-header': mamk_header;
    }
}
