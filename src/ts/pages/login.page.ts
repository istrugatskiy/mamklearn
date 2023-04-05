import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('login-page')
export class login_page extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }
        `,
    ];

    render() {
        const google_logo = new URL('../../img/Google__G__Logo.svg', import.meta.url);
        return html`
            <div>
                <div style="text-align: center; display: flex; align-items: center; justify-content: center">
                    <p class="pleaseLogin button buttonLikeTitle" id="loginInstructionsText">Please login with your Mamaroneck Schools Google Account.</p>
                </div>
                <p id="loginError1" style="font-size: large; color: red; margin: 0px; display: none; padding: 0px">Please use an account that ends in "mamkschools.org" or "student.mamkschools.org"</p>
                <div style="text-align: center; display: flex; align-items: center; justify-content: center">
                    <a class="button btn" id="loginBtn">
                        <img src="${google_logo}" alt="Google Logo" width="30" height="30" />
                        Sign in with Google
                    </a>
                </div>
                <p class="animateOnTransition" style="font-size: large; text-align: center; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif">By signing in you agree to our terms of service and privacy policy.</p>
            </div>
        `;
    }
}
