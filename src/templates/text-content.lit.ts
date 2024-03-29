import { LitElement, css } from 'lit';
import { normalize } from '../styles/normalize';

/**
 * A base class for text content. Useful for documentation and policy pages.
 * Use h2, p, and h1 tags to create content using this template.
 */
export class text_content extends LitElement {
    static styles = [
        normalize,
        css`
            *:focus {
                outline: none;
            }
            :host {
                height: fit-content;
                color: white;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                font-size: 16px;
                margin: 5px;
                padding: 10px;
                max-width: 800px;
            }
            h1 {
                text-align: center;
            }
            p,
            ul {
                font-size: 16px;
                text-shadow: 0 0 12px black;
                background-color: rgb(255 255 255 / 11.6%);
                border-radius: 3px;
                box-shadow: 0 0 12px #000;
                text-align: left;
                padding: 10px; /* Safari */ /* IE 10 and IE 11 */
                user-select: text;
                word-break: break-word;
            }
            ul {
                list-style-position: inside;
                list-style-type: none;
            }
            li {
                margin-bottom: 10px;
            }
            a {
                color: white;
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
                background: rgb(31 42 210 / 25%);
                color: white;
            }
            @media screen and (width <= 600px) {
                :host {
                    padding-top: 0;
                }
            }
            .center {
                text-align: center;
            }
        `,
    ];
}
