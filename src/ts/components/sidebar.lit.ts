import { css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { base_content } from './templates/base-content.lit';
import { routes } from '../routing/routes';

// Fixes customElementRegistry being written to twice.
if (module.hot) {
    module.hot.dispose(() => {
        window.location.reload();
    });
}
@customElement('side-bar')
export class side_bar extends base_content {
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
                display: block;
                /* background-color: white; */
                border-radius: 10px;
                margin: 10px;
                width: 100%;
                max-width: 300px;
                animation: slide-in-from-left 0.3s cubic-bezier(0.29, 0.09, 0.07, 1.2);
                animation-fill-mode: forwards;
            }
            h1 {
                font-size: 32px;
                color: white;
                font-family: Chelsea Market, cursive;
                text-align: center;
                height: min-content;
            }
            ul {
                padding: 20px;
            }
            li {
                list-style-type: none;
            }
            @media screen and (max-width: 1000px) {
                ::-webkit-scrollbar {
                    width: 10px;
                    height: 10px;
                }
                ::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.596);
                    border-radius: 10px;
                }
                ::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0);
                }
                :host {
                    height: min-content;
                    max-width: 100vw;
                    flex-wrap: wrap;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-basis: auto;
                }
                ul {
                    display: flex;
                    flex-wrap: no-wrap;
                    align-items: center;
                    overflow-x: auto;
                    padding: 0;
                }
                li {
                    flex: 0 0 auto;
                    width: auto;
                    height: auto;
                    max-width: 100%;
                }
                sidebar-button {
                    width: 150px;
                    margin: 10px;
                }
            }
            @media screen and (max-width: 600px) {
                sidebar-button {
                    width: 125px;
                }
                :host {
                    margin: 0;
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

    halt_UI = () => {
        this.disabled = true;
    };

    resume_UI = () => {
        this.disabled = false;
    };

    render() {
        return html`<mamk-header>Mamklearn v2</mamk-header>
            <ul>
                ${Object.entries(routes.layout)
                    .filter(([, value]) => value.show_user)
                    .map(([key, value]) => html`<li><sidebar-button ?data-disabled=${window.location.pathname == key || this.disabled} data-href="${key}">${value.title}</sidebar-button></li>`)}
            </ul>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'side-bar': side_bar;
    }
}
