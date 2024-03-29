import { css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { link_button } from './link-button.lit';

/**
 * Button class that is customized for use on the sidebar.
 * @implements link_button
 */
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
                margin: 0;
                margin-top: 10px;
            }
            .button {
                display: flex;
                font-size: 16px;
                padding: 10px;
                justify-content: flex-start;
            }
        `,
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        'sidebar-button': sidebar_button;
    }
}
