import { css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { link_button } from './link-button.lit';

@customElement('sidebar-button')
export class sidebar_button extends link_button {
    static styles = [
        link_button.styles,
        css`
            :host {
                display: block;
                margin: 0;
            }
            a {
                display: block;
                padding: 10px;
                margin: 0;
                margin-top: 10px;
            }
            .button {
                font-size: 24px;
            }
            /* when disabled highlight current link */
            :host([data-disabled]) a {
                text-decoration: underline;
            }
        `,
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        'sidebar-button': sidebar_button;
    }
}
