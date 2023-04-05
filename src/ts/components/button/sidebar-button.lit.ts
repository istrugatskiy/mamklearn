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
                display: flex;
                padding: 10px;
                margin: 0;
                margin-top: 10px;
                align-items: center;
                justify-content: center;
            }
            .button {
                font-size: 16px;
            }
            /* when disabled highlight current link */
            :host([data-disabled]) a {
                text-decoration: underline;
            }
            @media screen and (max-width: 600px) {
                .button {
                    padding: 0px;
                }
                a {
                    min-height: 66px;
                }
            }
        `,
    ];
}

declare global {
    interface HTMLElementTagNameMap {
        'sidebar-button': sidebar_button;
    }
}
