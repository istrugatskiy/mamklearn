import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { text_content } from '../templates/text-content.lit';

/**
 * A page that displays information about the mamklearn app including software licenses and author information.
 * @element about-page
 */
@customElement('about-page')
export class about extends text_content {
    protected render() {
        return html`
            <div class="page">
                <h1>About Mamklearn</h1>
                <p>
                    Mamklearn is a quiz/learning app which puts security, ease of use, fun, and animation first. Our app uses sign in with google to ensure that students sign in with their school accounts. Mamklearn allows students and teachers to
                    create their own player avatar, so that they can express themselves without usernames. Mamklearn is also designed with ease of use and animation in mind. The app has been tested with a wide variety of users with varying computer
                    skill levels. As well as this, almost everything has an animation, something we are extremely proud of.
                </p>
                <p class="center">Created by Ilya Strugatskiy</p>
                <h1>Software Licenses</h1>
                <h2>Particles.js</h2>
                <p class="center">
                    <a href="https://github.com/VincentGarreau/particles.js/blob/master/LICENSE.md" target="_blank" rel="noopener noreferrer">View License</a>
                </p>
                <h2>Material Icons</h2>
                <p class="center">
                    <a href="https://github.com/google/material-design-icons/blob/master/LICENSE" target="_blank" rel="noopener noreferrer">View License</a>
                </p>
                <h2>Lit</h2>
                <p class="center">
                    <a href="https://github.com/lit/lit/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">View License</a>
                </p>
                <h2>Roboto Mono Font</h2>
                <p class="center">
                    <a href="https://github.com/googlefonts/roboto/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">View License</a>
                </p>
            </div>
        `;
    }
}
