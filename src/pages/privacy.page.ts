import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { text_content } from '../templates/text-content.lit';

/**
 * The privacy policy page.
 * @element privacy-policy-page
 */
@customElement('privacy-policy-page')
export class privacy_policy extends text_content {
    protected render() {
        return html`
            <h1>Privacy Policy</h1>
            <h2>Introduction</h2>
            <p>
                This Privacy Policy is meant to help you understand what data we collect, why we collect your data, with whom we share your data, and how to delete your data. When we refer to "Mamklearn", "us", "we", and "our" we mean the current
                operators and developers of our site located at mamklearn.com, and the term "you" is defined as you while using our service.
            </p>
            <h2>What Data We Collect</h2>
            <p>
                There are two types of information that we collect: data you create or provide to us and data that is created when you use our service. When you sign in with google we collect your name, email address, and google OAuth token. We also
                collect data such as the quizzes that you create, data about quizzes you've played, and configuration data about your customizable character. Some information that we collect is not directly provided to us by you but is rather
                collected through Firebase Analytics. This data may include crash reports, your operating system/browser, how long you stay on our app, and other metadata. We do not associate this type of data with any specific user.
            </p>
            <h2>Why We Collect Data</h2>
            <p>
                Any data that we collect serves one or both of the following purposes: to provide you with our service, and/or to improve our service. For example, we need your email address to verify that you are logging in with a school account. We
                may also use your data to moderate for things such as inappropriate language. Data such as crash reports are used to identify issues in the app and help resolve them faster.
            </p>
            <h2>When Your Data is Shared</h2>
            <p>
                Your data may be shared with the following parties listed later in the paragraph and may be used internally for moderation purposes. Your data is shared with google for the purposes of providing our service, you can view the partner
                site policy
                <a target="_blank" rel="noopener noreferrer" href="https://policies.google.com/technologies/partner-sites">here</a>. Your data may also be shared with your educational institution if requested. Finally, any data provided may be shared
                to comply with local laws, regulations, or to comply with warrants.
            </p>
            <h2>How To Manage Your Data</h2>
            <p>If you need to view your data, or want your data deleted please contact is@mamklearn.com.</p>
            <h2>Users Under 13</h2>
            <p>
                Please review the privacy policy with a parent or legal guardian before using this service. Mamklearn does not collect age information or parent emails because we believe that this data is not integral to our service. Parents may
                contact us at is@mamklearn.com with any concerns or questions.
            </p>
        `;
    }
}
