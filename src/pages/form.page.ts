import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { base_content } from '../templates/base-content.lit';
import '../components/mamk-header.lit';

/**
 * The mamklearn forms user facing interface.
 * @element forms-page
 */
@customElement('form-page')
export class form_page extends base_content {
    static styles = [
        base_content.styles,
        css`
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            form {
                background-color: rgb(0 0 0 / 20%);
                padding: 10px;
            }
        `,
    ];

    halt_ui = () => {
        this.disabled = true;
    };

    resume_ui = () => {
        this.disabled = false;
    };

    protected render() {
        return html`<mamk-header>{Form Name}</mamk-header>
            <form><input type="text" class="button" /></form>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'form-page': form_page;
    }
}
