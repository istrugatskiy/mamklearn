import { html } from 'lit';
import { base_content } from '../../templates/base-content.lit';
import { customElement, property } from 'lit/decorators';
import { redirect } from '../../routing/router';

/**
 * A button that redirects to a new page.
 * @element link-button
 * @slot The content of the button.
 */
@customElement('link-button')
export class link_button extends base_content {
    resume_ui?: (() => void) | undefined;
    halt_ui?: (() => void) | undefined;

    /**
     * The internal path to redirect to.
     * @remarks This is not the same as the href attribute. It should only refer to internal paths part of the application.
     * @example '/login'
     */
    @property({ type: String, reflect: true, attribute: 'data-href' })
    href = '';

    /**
     * An internal function that redirects to the path specified by {@link href}.
     * @param e - The event that triggered the redirect.
     * @returns Nothing.
     */
    private redirect = (e: Event) => redirect(this.href, e);

    protected render() {
        return html`
            <a href="${this.href}" class="button" @click=${this.redirect}>
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
