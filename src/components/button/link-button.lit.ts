import { html } from 'lit';
import { base_content } from '../../templates/base-content.lit';
import { customElement, property } from 'lit/decorators';
import { redirect } from '../../routing/router';

/**
 * A button that redirects to a new page.
 * @element link-button
 * @slot The content of the button.
 * @property {string} data-href - The href to redirect to.
 */
@customElement('link-button')
export class link_button extends base_content {
    resume_ui?: (() => void) | undefined;
    halt_ui?: (() => void) | undefined;

    @property({ type: String, reflect: true, attribute: 'data-href' })
    href = '';

    render() {
        return html`
            <a href="${this.href}" class="button" @click=${(e: Event) => redirect(this.href, e)}>
                <slot></slot>
            </a>
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'link-button': link_button;
    }
}
