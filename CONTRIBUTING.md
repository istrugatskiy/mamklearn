# Contributing to Mamklearn

This guide describes the layout of the Mamklearn project.

## Style Guide

Mamklearn uses prettier to style its code.
Use camel_case for all typescript names.
Prefer types over interfaces whenever possible.
CSS classess should use dashes. Ex: '.hello-world'
Legacy server code may not comply with this standard.
All lit component files should end in '.lit.ts'.
All lit pages should end in '.page.ts'.

## Project Structure

-   `/legacy` - Legacy mamklearn code from Mamklearn v1, kept only to help with porting to mamklearn v2.
-   `/functions` - Cloud functions used by Mamklearn.
-   `/src` - New codebase root.
    -   `/@types` - Types used by Mamklearn.
    -   `/components` - Mamklearn's shared components. For any components used across different pages.
    -   `/images` - Global images used across different Mamklearn components. Will decrease in size as more images are moved to their specific component.
    -   `/ost` - Mamklearn's original soundtrack.
    -   `/pages` - All web pages used by Mamklearn go here.
    -   `/routing` - Routing tools used Mamklearn. Has config for Mamklearn's page layout.
    -   `/scripts` - Additional scripts used by Mamklearn.
    -   `/src-img` - Many of Mamklearn's images were originally done in paint.net and were saved as pngs. They were later conveerted to svg files. This folder contains the original images.
    -   `/styles` - Global styles used by Mamklearn at page load.
    -   `/templates` - Core templates used by many Mamklearn components.
-   `mamk-config.json` - Config file used by mamklearn's client and server side.

## Libraries Used

Mamklearn uses the following tools (non exhaustive list):

-   [Parcel](https://github.com/parcel-bundler/parcel) - To build the project without the pain of Webpack.
-   [Lit](https://github.com/lit/lit) - To generate dynamic and performant web components.
-   [Particles.js](https://github.com/VincentGarreau/particles.js/) - For particle backgrounds

## Build Issues

Periodically Parcel (Mamklearn's build tool) gets confused.
It may fail to build or build out-of-sync code.
The commands below will purge Parcel's cache:

-   Windows: `yarn run win-clean`
-   Linux: `yarn run clean`
