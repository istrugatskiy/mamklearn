import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { text_content } from '../templates/text-content.lit';
import { redirect } from '../routing/router';

/**
 * Terms of service page.
 * @element terms-of-service-page
 */
@customElement('terms-of-service-page')
export class terms_of_service extends text_content {
    private redirect_privacy_policy = (e: Event) => {
        redirect('/privacy-policy', e);
    };

    // This was copilot generated.
    // I don't know what this TOS means.
    protected render() {
        return html`
            <div class="page">
                <h1>Terms of Service</h1>
                <h2>Introduction</h2>
                <p>
                    These terms are effective May 12, 2023 and govern the relationship between you and Mamklearn. You may not use our services without first reading through and agreeing to these terms. When we refer to "Mamklearn", "us", "we", and
                    "our" we mean the current operators and developers of our site located at mamklearn.com.
                </p>
                <h2>Changes to Our Terms</h2>
                <p>
                    We may revise these terms from time to time. The most current version of the terms will be indicated by the date at the top of this page. We encourage you to review these terms whenever you use our site to stay informed about our
                    practices. Your continued use of our site following the posting of revised terms means that you accept and agree to the changes. You are expected to check this page from time to time so you are aware of any changes, as they are
                    binding on you.
                </p>
                <h2>Links to Other Sites</h2>
                <p>
                    Our site may contain links to other sites that are not operated by us. Mamklearn is not responsible for the content of any linked site or any link contained in a linked site. We provide these links only as a convenience and the
                    inclusion of a link does not imply endorsement of the linked site by us.
                </p>
                <h2>Governing Law</h2>
                <p>
                    Mamklearn is based in the United States in the State of New York. These terms are governed by the laws of the state of New York without regard to its conflict of law provisions. You and Mamklearn agree to submit to the personal
                    and exclusive jurisdiction of the courts located within the State of New York.
                </p>
                <h2>Privacy Policy</h2>
                <p>By using our service you agree to our privacy policy. Please review our privacy policy (available <a @click="${this.redirect_privacy_policy}" href="/privacy-policy">here</a>) to understand our practices.</p>
                <h2>Users Under 13</h2>
                <p>
                    You must be at least 13 years old to use our services. If you are under 13, you may use our services only with the involvement of a parent or legal guardian who agrees to be bound by these terms. If you are a parent or legal
                    guardian agreeing to these terms for the benefit of a child or ward who is under 13, you agree that you are responsible for your child's or ward's use of our services and you agree to be bound by these terms in respect to your
                    child's or ward's use of our services.
                </p>
                <h2>Account Registration</h2>
                <p>
                    In order to use some of our services, you must register for an account. You agree to provide accurate and complete information and to keep your account information up to date. You are responsible for maintaining the
                    confidentiality of your account login information and are fully responsible for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account or any other breach of
                    security. We will not be liable for any loss that you may incur as a result of someone else using your password or account, either with or without your knowledge. However, you could be held liable for losses incurred by us or
                    another party due to someone else using your account or password. You may not use anyone else's account at any time, without the permission of the account holder.
                </p>

                <h2>Limitation of Liability</h2>
                <p>
                    You agree that your use of our services is at your sole risk. Our services are provided on an "as is" and "as available" basis. We expressly disclaim all warranties of any kind, whether express or implied, including but not
                    limited to the implied warranties of merchantability, fitness for a particular purpose and non-infringement.
                </p>
                <h2>Disclaimer of Warranties</h2>
                <p>
                    We make no warranty that our services will meet your requirements, or that our services will be uninterrupted, timely, secure, or error-free; nor do we make any warranty as to the results that may be obtained from the use of our
                    services or as to the accuracy or reliability of any information obtained through our services. You understand and agree that any material and/or data downloaded or otherwise obtained through the use of our services is done at
                    your own discretion and risk and that you will be solely responsible for any damage to your computer system or loss of data that results from the download of such material and/or data.
                </p>
                <h2>Mamklearn's Intellectual Property</h2>
                <p>
                    Our site and our services are protected by copyright, trademark, and other laws of the United States and foreign countries. You agree not to copy, modify, rent, lease, loan, sell, distribute, or create derivative works based on
                    our services (either in whole or in part) unless expressly permitted by us. Any unauthorized use terminates the permission or license granted by us.
                </p>
                <h2>Copyright</h2>
                <p>We respect the intellectual property rights of others. If you believe that your work has been copied in a way that constitutes copyright infringement, please email is@mamklearn.com with the following information:</p>
                <ul>
                    <li>an electronic or physical signature of the person authorized to act on behalf of the owner of the copyright interest;</li>
                    <li>a description of the copyrighted work that you claim has been infringed;</li>
                    <li>a description of where the material that you claim is infringing is located on our site;</li>
                    <li>your address, telephone number, and email address;</li>
                    <li>a statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
                </ul>
                <p>
                    We reserve the right to remove content alleged to be infringing without prior notice and at our sole discretion. In appropriate circumstances, we will also terminate a user's account if the user is determined to be a repeat
                    infringer.
                </p>
                <h2>Content You Create</h2>
                <p>
                    You retain ownership of any content you create using our services. However, by submitting content to us, you grant us a non-exclusive, worldwide, perpetual, irrevocable, royalty-free, sub-licensable right to use, reproduce,
                    modify, adapt, publish, translate, create derivative works from, distribute, perform and display such content (in whole or part) worldwide and/or to incorporate it in other works in any form, media, or technology now known or
                    later developed for the full term of any rights that may exist in such content. You also grant us the right to use the name that you submit in connection with such content, if we choose. You represent and warrant that you own or
                    otherwise control all of the rights to the content that you post; that the content is accurate; that use of the content you supply does not violate these terms and will not cause injury to any person or entity; and that you will
                    indemnify us for all claims resulting from content you supply. We have the right but not the obligation to monitor and edit or remove any activity or content. We take no responsibility and assume no liability for any content
                    posted by you or any third party.
                </p>
                <h2>User Generated Content</h2>
                <p>You are solely responsible for any content that you upload, post, email, transmit or otherwise make available via our services. You agree not to upload, post, email, transmit or otherwise make available any content that:</p>
                <ul>
                    <li>is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically or otherwise objectionable;</li>
                    <li>
                        you do not have a right to make available under any law or under contractual or fiduciary relationships (such as inside information, proprietary and confidential information learned or disclosed as part of employment
                        relationships or under nondisclosure agreements);
                    </li>
                    <li>infringes any patent, trademark, trade secret, copyright, right of publicity, or other proprietary right of any party;</li>
                    <li>constitutes unauthorized or unsolicited advertising, any other form of unauthorized solicitation, or any form of lottery or gambling;</li>
                    <li>contains software viruses or any other computer code, files or programs designed to interrupt, destroy or limit the functionality of any computer software or hardware or telecommunications equipment;</li>
                    <li>impersonates any person or entity, including any of our employees or representatives.</li>
                </ul>
                <h2>Indemnification</h2>
                <p>
                    You agree to indemnify and hold us and our subsidiaries, affiliates, officers, agents, co-branders or other partners, and employees, harmless from any claim or demand, including reasonable attorneys' fees, made by any third party
                    due to or arising out of content you submit, post, transmit or otherwise make available through our services, your use of our services, your connection to our services, your violation of the terms, or your violation of any rights
                    of another.
                </p>
                <h2>Termination</h2>
                <p>
                    We may terminate your access to our services, without cause or notice, which may result in the forfeiture and destruction of all information associated with your account. All provisions of these terms which by their nature should
                    survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
                </p>
                <h2>General</h2>
                <p>
                    These terms constitute the entire agreement between you and us and govern your use of our services, superseding any prior agreements between you and us. You also may be subject to additional terms and conditions that may apply
                    when you use affiliate services, third-party content or third-party software. Our failure to exercise or enforce any right or provision of these terms shall not constitute a waiver of such right or provision. If any provision of
                    these terms is found by a court of competent jurisdiction to be invalid, the parties nevertheless agree that the court should endeavor to give effect to the parties' intentions as reflected in the provision, and the other
                    provisions of these terms remain in full force and effect. These terms operate to the fullest extent permissible by law. We may assign any or all of our rights and obligations to others at any time. We shall not be responsible or
                    liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control. If any part of these terms is held invalid or unenforceable, that part will be construed to reflect the parties' original
                    intent, and the remaining portions will remain in full force and effect. A waiver by either party of any term or condition of these terms or any breach thereof, in any one instance, will not waive such term or condition or any
                    subsequent breach thereof. You may assign your rights under these terms to any party that consents to, and agrees to be bound by, its terms and conditions; Mamklearn may assign its rights under these terms without condition. These
                    terms shall be binding upon and inure to the benefit of the parties, their successors and permitted assigns.
                </p>
            </div>
        `;
    }
}
