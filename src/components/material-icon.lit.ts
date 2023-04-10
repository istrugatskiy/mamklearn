import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('mat-icon')
export class mat_icon extends LitElement {
    static styles = [
        css`
            .material-symbols-outlined {
                font-family: 'Material Symbols Outlined';
                font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48;
                -webkit-user-select: none;
                user-select: none;
            }
        `,
    ];

    render() {
        return html`<span class="material-symbols-outlined"><slot></slot></span>`;
    }
}
