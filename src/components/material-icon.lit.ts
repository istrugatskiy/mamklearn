import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

/**
 * A material icon element that is styled for use on the mamklearn website.
 * @element mat-icon
 * @slot A string representing the icon to display.
 */
@customElement('mat-icon')
export class mat_icon extends LitElement {
    static styles = [
        css`
            :host {
                display: inline-flex;
            }
            .material-symbols-outlined {
                font-family: 'Material Symbols Outlined';
                font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48;
                -webkit-user-select: none;
                user-select: none;
                text-decoration: none;
            }
        `,
    ];

    protected render() {
        return html`<span class="material-symbols-outlined"><slot></slot></span>`;
    }
}
