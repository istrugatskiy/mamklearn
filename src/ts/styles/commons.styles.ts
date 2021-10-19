import { css } from 'lit';
import button from './button.styles';
import globals from './globals.styles';

export default css`
    ${button}
    ${globals}
    .scale-in {
        animation-name: scale;
        animation-duration: 0.3s;
        animation-timing-function: cubic-bezier(0.29, 0.09, 0.07, 1.6);
    }
    @keyframes scale {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }
`;
