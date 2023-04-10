/**
 * Parcel plugin to minify HTML literals in JavaScript files.
 * @see https://parceljs.org/plugin-system/api/#Transformer
 */

const { Transformer } = require('@parcel/plugin');
const { minifyHTMLLiterals } = require('minify-html-literals');

module.exports = new Transformer({
    async transform({ asset, logger }) {
        logger.verbose({
            message: `Transforming ${asset.filePath}, ${asset.type}`,
        });
        try {
            if (asset.type !== 'js') return [asset];
            const code = await asset.getCode();
            const minified = minifyHTMLLiterals(code, { fileName: asset.filePath, minifyOptions: { collapseWhitespace: true, minifyCSS: true } });
            if (!minified) return [asset];
            asset.setCode(minified.code);
            return [asset];
        } catch (error) {
            logger.error({
                message: `Error transforming ${asset.filePath}`,
                filePath: asset.filePath,
            });
            return [asset];
        }
    },
});
