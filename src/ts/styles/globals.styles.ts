import { css } from 'lit';
/* This file is for the global selectors that aren't specific to a class, id or anything like that */
export default css`
    button {
        appearance: button;
        -webkit-writing-mode: horizontal-tb !important;
        writing-mode: horizontal-tb !important;
        text-rendering: auto;
        color: -internal-light-dark(black, white);
        letter-spacing: normal;
        word-spacing: normal;
        text-transform: none;
        text-indent: 0px;
        text-shadow: none;
        display: inline-block;
        text-align: center;
        align-items: flex-start;
        cursor: default;
        background-color: -internal-light-dark(rgb(239, 239, 239), rgb(59, 59, 59));
        box-sizing: border-box;
        margin: 0em;
        font: 400 13.3333px Arial;
        padding: 1px 6px;
        border-width: 2px;
        border-style: outset;
        border-color: -internal-light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
        border-image: initial;
    }
    [contentEditable] {
        -webkit-user-modify: read-write;
        overflow-wrap: break-word;
        -webkit-line-break: after-white-space;
        line-break: after-white-space;
        -webkit-user-select: text;
        user-select: text;
    }
    tbody {
        display: table-row-group;
        vertical-align: middle;
        border-color: inherit;
    }
    tr {
        display: table-row;
        vertical-align: inherit;
        border-color: inherit;
    }
    table {
        border-collapse: separate;
        text-indent: initial;
        border-spacing: 2px;
    }
    th {
        display: table-cell;
        vertical-align: inherit;
        font-weight: bold;
        text-align: center;
    }
    html {
        -webkit-font-smoothing: antialiased;
        box-sizing: border-box;
    }
    img {
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
    }
    *:before,
    *:after {
        box-sizing: inherit;
    }
    input[type='checkbox'] > * {
        pointer-events: none;
    }
    ::selection {
        background: hsla(212, 100%, 83%, 0.678); /* WebKit/Blink Browsers */
    }
    ::-moz-selection {
        background: hsla(212, 100%, 83%, 0.678); /* Gecko Browsers */
    }
    canvas {
        width: 100%;
        height: 100%;
        background-size: cover;
    }
    body {
        padding: 0px;
        margin: 0px;
        bottom: 0px;
        overflow-x: hidden;
        outline: none;
        overflow-y: overlay;
        background-color: #eee;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
    }
    :focus {
        outline: -webkit-focus-ring-color auto 0;
    }
    @media (prefers-reduced-motion: reduce) {
        * {
            -webkit-animation-play-state: paused;
            -moz-animation-play-state: paused;
            -o-animation-play-state: paused;
            animation-play-state: paused;
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            transition: none !important;
            -webkit-animation: none !important;
            -moz-animation: none !important;
            -o-animation: none !important;
            -ms-animation: none !important;
            animation: none !important;
        }
        canvas {
            display: none;
        }
    }
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }
    ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.596);
        border-radius: 10px;
    }
    ::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0);
    }
    li {
        list-style-type: none;
        float: left;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type='number'] {
        -moz-appearance: textfield;
    }
    [contentEditable='true']:empty:not(:focus):before {
        content: attr(placeholder);
        color: grey;
    }
    [contentEditable='true'] {
        word-break: break-word;
        white-space: break-spaces;
    }
    button::-moz-focus-inner {
        border: 0;
    }
    *:focus {
        outline: 0;
    }
`;
