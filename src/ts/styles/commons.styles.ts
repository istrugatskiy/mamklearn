import { css } from 'lit';
import button from './button.styles';
import globals from './globals.styles';
import title from './title.styles';

export default css`
    ${button}
    ${globals}
    ${title}
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
    .scale-out {
        transition: all 0.3s ease-out;
        transform: scale(0);
        visibility: hidden;
        transition-timing-function: cubic-bezier(0.29, 0.09, 0.07, 1.65);
    }
    .static-button {
        font-size: 48px;
        cursor: default;
        width: 95%;
        margin: 25px auto;
        text-overflow: ellipsis;
        height: auto;
        text-align: center;
        display: flex;
        align-items: center;
        white-space: wrap;
        overflow: auto;
        justify-content: center;
    }
    .static-button:hover,
    .static-button:active,
    .static-button:focus {
        background-color: white;
        border: 2px solid white;
        text-decoration: none;
        border-radius: 30px;
        transform: scale(1);
        border-color: rgba(255, 255, 255, 0);
        background-color: white !important;
        color: black;
        box-shadow: 0px 0px 12px #000000;
    }
`;
