import { html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { base_content } from '../templates/base-content.lit';

/**
 * The login page where the user logs in.
 * @element login-page
 */
@customElement('login-page')
export class login_page extends base_content {
    static styles = [
        base_content.styles,
        css`
            :host {
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                max-width: 600px;
                margin: 10px;
            }
            img {
                margin-right: 10px;
            }
            .content {
                margin-bottom: 20px;
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
        const google_logo = new URL('/src/images/google-logo.svg', import.meta.url).href;
        const url_search_params = new URLSearchParams(window.location.search);
        // This property appears only when the user's email isn't valid.
        const invalid_email_exists = !!url_search_params.get('invalid_email');
        const email_ending = url_search_params.get('email_ending');
        if (invalid_email_exists) {
            history.replaceState({ index: history.state?.index }, document.title, '/');
        }
        return html`
            <mamk-header>Login Required</mamk-header>
            <p class="content">
                ${invalid_email_exists ? html`Emails ending with '${email_ending}' <em>are not</em> supported by mamklearn. Please use your school account instead.` : html`Sign in with an account associated with your school or university.`}
            </p>
            <link-button data-href="/login">
                <img src="${google_logo}" alt="Google Logo" width="30" height="30" />
                Sign in with Google
            </link-button>
            <mamk-para>By signing in you agree to Mamklearn's terms of service and privacy policy.</mamk-para>
        `;
    }
}
