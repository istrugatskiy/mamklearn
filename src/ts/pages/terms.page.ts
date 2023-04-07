import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { text_content } from '../components/templates/text-content.lit';

@customElement('terms-of-service-page')
export class terms_of_service extends text_content {
    render() {
        return html`
            <h1>Terms of Service</h1>
            <h2>Introduction</h2>
            <p>
                These terms are effective March 21, 2021 and govern the relationship between you and Mamklearn. You may not use our services without first reading through and agreeing to these terms. When we refer to "Mamklearn", "us", "we", and
                "our" we mean the current operators and developers of our site located at mamklearn.com.
            </p>
            <p>
                Mamklearn SPECIFICALLY DISCLAIMS ANY AND ALL WARRANTIES AND CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING OR USAGE OF TRADE. Mamklearn takes
                no responsibility and assumes no liability for any User Content that you or any other user or third party posts or transmits using our Products. You understand and agree that you may be exposed to User Content that is inaccurate,
                objectionable, inappropriate for children, or otherwise unsuited to your purpose. Limitation of Liability TO THE MAXIMUM EXTENT PERMITTED BY LAW, Mamklearn SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
                INDIRECT, PUNITIVE, INCIDENTAL, OR SPECIAL DAMAGES, LOSS OF PROFITS, DATA OR REVENUES, OR OTHER INTANGIBLE LOSSES, RESULTING FROM ANY OF THE FOLLOWING:
                <br />
                YOUR USE OF OUR PRODUCTS
                <br />
                YOUR INABILITY TO ACCESS OR USE ANY OF OUR PRODUCTS
                <br />
                UNAUTHORIZED ACCESS OR USE OF OUR PRODUCTS, INCLUDING UNAUTHORIZED ACCESS OR USE OF YOUR TRANSACTIONS, TRANSMISSIONS OR CONTENT
                <br />
                ACCESS OR USE OF OUR PRODUCTS BY ANY THIRD PARTY, INCLUDING OFFENSIVE, DEFAMATORY OR ILLEGAL ACTIONS
            </p>
            <h2>Users Under 13</h2>
            <p>If you're under the age of 13 please review these terms with a parent or legal guardian.</p>
        `;
    }
}
