import { html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';

type options = 'Eyes' | 'Nose' | 'Mouth' | 'Shirt' | 'Arms';
const customOptions = ['Eyes', 'Nose', 'Mouth', 'Shirt', 'Arms'];

export class Character extends LitElement {
    @property({
        attribute: 'data-character',
        type: Array,
    })
    characterConfig: number[] | undefined;

    constructor() {
        super();
    }

    /**
     * Get the src of the image that corresponds to the currently configured character.
     * @param string data
     */
    private getSrc(property: options): string {
        const lookupIndex = customOptions.indexOf(property);
        if (lookupIndex == -1) {
            return 'img/qIcon-0.svg';
        }
        return this.characterConfig ? `img/${property}-${this.characterConfig[lookupIndex].toString()}.${lookupIndex == 4 ? 'svg' : 'png'}` : 'data:,';
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
