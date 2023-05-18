import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { base_content } from '../templates/base-content.lit';
import { routes } from '../routing/routes';
import './button/sidebar-button.lit';
import './button/inline-link.lit';
import './material-icon.lit';

// Fixes customElementRegistry being written to twice.
if (module.hot) {
    module.hot.dispose(() => {
        window.location.reload();
    });
}

// TODO: Add a button to the bottom of the sidebar that opens the sidebar for mobile users.

/**
 * A sidebar element displayed on the left side of the screen. It generates content from the routes.
 * @element side-bar
 */
@customElement('side-bar')
export class side_bar extends base_content {
    // Probably will make fixed to right side of screen.
    // And remove the top bar when in mobile view.
    static styles = [
        base_content.styles,
        css`
            @keyframes slide-in-from-left {
                0% {
                    transform: translateX(-100%);
                }
                100% {
                    transform: translateX(0);
                }
            }
            :host {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                border-radius: 10px;
                margin: 15px;
                width: fit-content;
                max-width: min(30vw, 250px);
                animation: slide-in-from-left 0.3s cubic-bezier(0.29, 0.09, 0.07, 1.2);
                animation-fill-mode: forwards;
                background-color: rgba(0, 0, 0, 0.2);
                height: calc(100vh - 40px);
                overflow-y: auto;
                box-sizing: border-box;
            }
            ul {
                padding: 10px;
            }
            li {
                list-style-type: none;
            }
            .large-icon {
                font-size: 32px;
                text-decoration: none;
            }
            p {
                color: white;
                font-size: 16px;
                text-align: center;
                margin: 0;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            .bottom-bar {
                display: flex;
                flex-direction: row;
                justify-content: center;
                flex-wrap: wrap;
                padding: 10px;
            }
            .open-menu {
                display: none;
            }
            @media screen and (max-width: 900px) {
                .open-menu {
                    display: flex;
                    width: fit-content;
                    font-size: 32px;
                    padding: 5px;
                    margin: 10px;
                    border-radius: 100px;
                }
                :host {
                    background-color: transparent;
                }
                .sidebar-container {
                    display: none;
                }
                :host {
                    height: fit-content;
                }
            }
        `,
    ];

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('mamk-route-change', this.on_route_change);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('mamk-route-change', this.on_route_change);
    }

    private on_route_change = () => {
        this.requestUpdate();
    };

    halt_ui = () => {
        this.disabled = true;
    };

    resume_ui = () => {
        this.disabled = false;
    };

    protected render() {
        return html`<button class="button open-menu"><mat-icon>menu_open</mat-icon></button>
            <div class="sidebar-container">
                <div>
                    <mamk-header>Mamklearn v2</mamk-header>
                    <ul>
                        ${Object.entries(routes.layout)
                            .filter(([, value]) => value.show_user)
                            .map(
                                ([key, value]) =>
                                    html`<li>
                                        <sidebar-button ?data-disabled=${window.location.pathname == key || this.disabled} data-href="${key}"><mat-icon class="large-icon">${value.icon}</mat-icon>${value.title}</sidebar-button>
                                    </li>`
                            )}
                    </ul>
                </div>
                <div>
                    <hr />
                    <div class="bottom-bar">
                        <inline-link data-href="/terms-of-service">Terms of Service</inline-link>
                        <inline-link data-href="/privacy-policy">Privacy Policy</inline-link>
                        <inline-link data-href="/about">About</inline-link>
                        <p>&copy; Copyright 2023 <inline-link data-href="https://github.com/istrugatskiy">Ilya Strugatskiy</inline-link></p>
                    </div>
                </div>
            </div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'side-bar': side_bar;
    }
}
