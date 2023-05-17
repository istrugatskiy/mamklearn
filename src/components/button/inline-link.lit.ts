import { css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { link_button } from './link-button.lit';

/**
 * A link that is displayed inline.
 * @element inline-link
 * @slot - The content of the link.
 */
@customElement('inline-link')
export class inline_link extends link_button {
    static styles = [
        css`
            :host {
                display: inline-block;
                margin: 10px;
            }
            a {
                color: white;
                transition: all 0.2s ease-in-out;
                cursor: pointer;
                display: inline-block;
                font-size: 14px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            a:focus {
                transition: all 0.1s;
                box-shadow: 0 0 0 0.25rem #ffffff9f;
                border-radius: 10px;
            }
        `,
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        'inline-link': inline_link;
    }
}
