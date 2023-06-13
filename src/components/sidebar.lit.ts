import { css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { base_content } from '../templates/base-content.lit';
import { sleep } from '@istrugatskiy/mamk-utils';
import router from '../scripts/router-config';
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
    // Probably will make fixed to left side of screen.
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
                display: block;
                height: calc(100vh - 40px);
                max-width: 250px;
                margin: 15px;
            }
            .sidebar-container {
                border-radius: 10px;
                width: fit-content;
                animation: slide-in-from-left 0.3s cubic-bezier(0.29, 0.09, 0.07, 1.2);
                animation-fill-mode: forwards;
                background-color: rgb(0 0 0 / 20%);
                overflow-y: auto;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100%;
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
                flex-flow: row wrap;
                justify-content: center;
                padding: 10px;
            }
            .mobile-overlay {
                opacity: 0;
            }
            .open-menu {
                display: none;
            }
            @keyframes scale-in {
                0% {
                    transform: scale(0);
                    opacity: 0;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            @media screen and (width <= 900px) {
                .open-menu {
                    animation: scale-in 0.3s cubic-bezier(0.29, 0.09, 0.07, 1.2);
                    animation-fill-mode: forwards;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    padding: 5px;
                    border-radius: 100%;
                    width: 40px;
                    height: 40px;
                }
                :host {
                    position: fixed;
                }
                .sidebar-container {
                    display: none;
                }
                .mobile-overlay[data-open] {
                    position: fixed;
                    display: block;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgb(0 0 0 / 50%);
                    z-index: -1;
                    /* stylelint-disable-next-line property-no-vendor-prefix */
                    -webkit-backdrop-filter: blur(5px) brightness(0.6);
                    backdrop-filter: blur(5px) brightness(0.6);
                    transition: opacity 0.3s cubic-bezier(0.29, 0.09, 0.07, 1.2);
                    opacity: 1;
                }
                .mobile-overlay.fade-out {
                    opacity: 0;
                }
                .open-menu[data-open] {
                    display: none;
                }
                .sidebar-container[data-open] {
                    display: flex;
                }
            }
            @keyframes slide-out-to-left {
                0% {
                    transform: translateX(0);
                    opacity: 1;
                }
                100% {
                    transform: translateX(-100%);
                    opacity: 0;
                }
            }
            .slide-out-left {
                animation: slide-out-to-left 0.3s cubic-bezier(0.29, 0.09, 0.07, 1.2);
                animation-fill-mode: forwards;
            }
            @keyframes scale-out {
                0% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(0);
                    opacity: 0;
                }
            }
            .scale-out {
                animation: scale-out 0.3s cubic-bezier(0.29, 0.09, 0.07, 1.2);
                animation-fill-mode: forwards;
            }
        `,
    ];

    private readonly media_query = window.matchMedia('(max-width: 900px)');

    private readonly mq_change = () => (this.media_query.matches ? this.hide_sidebar() : this.show_sidebar());

    connectedCallback() {
        super.connectedCallback();
        window.addEventListener('mamk-route-change', this.on_route_change);
        this.media_query.addEventListener('change', this.mq_change);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        window.removeEventListener('mamk-route-change', this.on_route_change);
        this.media_query.removeEventListener('change', this.mq_change);
    }

    private on_route_change = () => {
        this.requestUpdate();
        if (this.media_query.matches) this.hide_sidebar();
    };

    halt_ui = () => {
        this.disabled = true;
    };

    resume_ui = () => {
        this.disabled = false;
    };

    private show_sidebar = async () => {
        window.dispatchEvent(new Event('mamk-halt-ui'));
        if (router.routes.$outlet) router.routes.$outlet.tabIndex = -1;
        this.button_dissapearing = true;
        await sleep(300);
        this.menu_open_mobile = true;
        this.button_dissapearing = false;
        // Resume only the sidebar, not the whole UI.
        this.resume_ui();
    };

    private hide_sidebar = async () => {
        this.halt_ui();
        if (router.routes.$outlet) router.routes.$outlet.tabIndex = 0;
        this.menu_slide_left = true;
        await sleep(300);
        this.menu_open_mobile = false;
        this.menu_slide_left = false;
        window.dispatchEvent(new Event('mamk-resume-ui'));
    };

    @state()
    private menu_open_mobile = !this.media_query.matches;

    @state()
    private button_dissapearing = false;

    @state()
    private menu_slide_left = false;

    protected render() {
        const legal_items = ['/terms-of-service', '/privacy-policy', '/about'];
        const items_to_show = router.is_signed_in ? ['/', '/play', '/my-quizzes', '/logout'] : ['/login', ...legal_items];
        return html`<button class="button open-menu ${this.button_dissapearing ? 'scale-out' : ''}" @click=${this.show_sidebar} ?disabled=${this.disabled} ?data-open=${this.menu_open_mobile}>
                <mat-icon>menu_open</mat-icon>
            </button>
            <div class="sidebar-container ${this.menu_slide_left ? 'slide-out-left' : ''}" ?data-open=${this.menu_open_mobile}>
                <div>
                    <mamk-header>Mamklearn v2</mamk-header>
                    <ul>
                        ${Object.entries(router.routes.layout)
                            .filter(([key]) => items_to_show.includes(key))
                            .map(
                                ([key, value]) =>
                                    html`<li>
                                        <sidebar-button ?data-disabled=${window.location.pathname == key || this.disabled} data-href="${key}">
                                            <mat-icon class="large-icon">${value.icon} </mat-icon>
                                            ${value.title}</sidebar-button
                                        >
                                    </li>`
                            )}
                    </ul>
                </div>
                <div>
                    <hr />
                    <div class="bottom-bar">
                        ${router.is_signed_in ? legal_items.map((key) => html`<inline-link data-href="${key}">${router.routes.layout[key].title}</inline-link>`) : ''}
                        <p>
                            &copy; Copyright 2023
                            <inline-link data-href="https://github.com/istrugatskiy">Ilya Strugatskiy</inline-link>
                        </p>
                    </div>
                </div>
            </div>
            <div class="mobile-overlay ${this.menu_slide_left ? 'fade-out' : ''}" ?data-open=${this.menu_open_mobile} @click=${this.hide_sidebar}></div>`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'side-bar': side_bar;
    }
}
