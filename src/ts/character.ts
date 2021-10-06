import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators';

type options = 'Eyes' | 'Nose' | 'Mouth' | 'Shirt' | 'Arms';
const customOptions = ['Eyes', 'Nose', 'Mouth', 'Shirt', 'Arms'];

@customElement('user-char')
export class character extends LitElement {
    @property()
    characterConfig: number[] | undefined;

    /**
     * Get the src of the image that corresponds to the currently configured character.
     * @param string data
     */
    private getSrc(property: options): string {
        const lookupIndex = customOptions.indexOf(property);
        return this.characterConfig ? this.characterConfig[lookupIndex].toString() : 'data:,';
    }

    render() {
        return html`
            <div>
                <img alt="your arms" src="${this.getSrc('Arms')}" style="position: absolute" width="250" height="337" />
                <img alt="your eyes" src="${this.getSrc('Eyes')}" style="position: absolute" width="250" height="337" />
                <img alt="your nose" src="${this.getSrc('Nose')}" style="position: absolute" width="250" height="337" />
                <img alt="your mouth" src="${this.getSrc('Mouth')}" style="position: absolute" width="250" height="337" />
                <img alt="your shirt" src="${this.getSrc('Shirt')}" style="position: absolute" width="250" height="337" />
                <img alt="your profile picture" src="img/base.svg" width="250" height="337" />
            </div>
        `;
    }
}
