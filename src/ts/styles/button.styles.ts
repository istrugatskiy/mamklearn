import { css } from 'lit';

export default css`
    .button {
        -webkit-appearance: none;
        background-color: white;
        border: 2px solid white;
        text-decoration: none;
        border-radius: 30px;
        transform: scale(1);
        border-color: rgba(255, 255, 255, 0);
        color: black;
        cursor: pointer;
        text-align: center;
        font-family: 'Roboto Mono', monospace;
        font-size: 64px;
        transition: background-color 0.3s, border-radius 0.3s, color 0.3s, box-shadow 0.3s, transform 0.3s, width 0.3s, height 0.3s;
        box-shadow: 0px 0px 12px #000000;
    }
    .button > * {
        pointer-events: none;
    }
    .button:active {
        background-color: rgba(31, 42, 210, 0.25);
        border-radius: 12px;
        color: white;
        box-shadow: none;
    }
    .button:focus {
        background-color: rgba(31, 42, 210, 0.25);
        border-radius: 12px;
        color: white;
        box-shadow: none;
    }
    .button:disabled {
        background-color: rgba(31, 42, 210, 0.25);
        border-radius: 12px;
        color: white;
        box-shadow: none;
        cursor: default;
    }
    @media (hover: hover) and (pointer: fine) {
        .button:hover {
            background-color: rgba(31, 42, 210, 0.25);
            border-radius: 12px;
            color: white;
        }
    }
`;
