// @ts-check
/**
 * @param {string} src
 */
export default (src) => {
    // find template literals.
    const templateLiterals = src.match(/html`([^`]*)`/g);
    // Remove unnecessary whitespace from template literals.
    if (templateLiterals) {
        templateLiterals.forEach((literal) => {
            const literalWithoutQuotes = literal.replace(/`/g, '');
            // regex for at least two whitespace characters or newlines or tab.
            const regex = /\s{2,}|\n|\t/g;
            const literalWithoutWhitespace = literalWithoutQuotes.replace(regex, ' ');
            src = src.replace(literal, literalWithoutWhitespace);
        });
    }
};
