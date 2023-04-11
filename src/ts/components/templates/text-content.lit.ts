import { LitElement, css } from 'lit';

/**
 * A base class for text content. Useful for documentation and policy pages.
 * Use h2, p, and h1 tags to create content using this template.
 */
export class text_content extends LitElement {
    static styles = [
        css`
            *:focus {
                outline: none;
            }
            :host {
                display: block;
                padding: 16px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0 auto;
                max-width: 800px;
                text-align: left;
                color: white;
            }
            h1 {
                text-align: center;
            }
            p {
                font-size: 16px;
                text-shadow: 0px 0px 12px black;
                -webkit-backdrop-filter: blur(20px);
                backdrop-filter: blur(20px);
                background-color: rgba(255, 255, 255, 0.116);
                text-align: center;
                border-radius: 3px;
                box-shadow: 0px 0px 12px #000000;
                text-align: left;
                padding: 10px 10px 10px 10px;
                -webkit-user-select: text; /* Safari */
                -ms-user-select: text; /* IE 10 and IE 11 */
                user-select: text;
                word-break: break-word;
            }
            a {
                color: white;
                display: block;
                transition: all 0.2s ease-in-out;
                cursor: pointer;
                display: inline-block;
            }
            a:focus {
                transition: all 0.1s;
                box-shadow: 0 0 0 0.25rem #ffffff9f;
                border-radius: 10px;
            }
            ::selection {
                background: rgba(31, 42, 210, 0.25);
                color: white;
            }
            @media screen and (max-width: 600px) {
                :host {
                    padding-top: 0;
                }
            }
        `,
    ];
}