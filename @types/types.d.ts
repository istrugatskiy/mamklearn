/**
 * The options for the character.
 */
type char_options = 'Eyes' | 'Nose' | 'Mouth' | 'Shirt' | 'Arms';

/**
 * Specific definition for mamk-config.yaml.
 */
declare module '*/mamk-config.yaml' {
    /**
     * The app version.
     * @example '1.0.0'
     */
    export const app_version: string;
    /**
     * The valid email domains to use for app login.
     */
    export const valid_email_domains: string[];
    /**
     * The list of admins for the app.
     * @example ilyastrug\@gmail.com
     */
    export const admins: string[];
}

declare module '*.css';
