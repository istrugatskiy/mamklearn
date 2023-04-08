import { css } from 'lit';

export default css`
    .title {
        height: 200px;
        width: 100%;
        pointer-events: none;
        position: absolute;
        font-family: 'Chelsea Market', cursive;
        color: white;
        text-align: center;
        top: 15%;
        margin-top: -50px;
        font-size: xx-large;
    }
    .title > * {
        pointer-events: all;
    }
`;
