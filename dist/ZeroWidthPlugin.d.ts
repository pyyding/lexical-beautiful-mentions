export declare const ZERO_WIDTH_CHARACTER = "\u200B";
interface ZeroWidthPluginProps {
    /**
     * Defines the return value of `getTextContent()`. By default, an empty string to not corrupt
     * the text content of the editor.
     *
     * Note: If other nodes are not at the correct position when inserting via `$insertNodes`,
     * try to use a non-empty string like " " or a zero-width character. But don't forget
     * to remove these characters when exporting the editor content.
     *
     * @default empty string
     */
    textContent?: string;
}
/**
 * This plugin serves as a patch to fix an incorrect cursor position in Safari.
 * It also ensures that the cursor is correctly aligned with the line height in
 * all browsers.
 * {@link https://github.com/facebook/lexical/issues/4487}.
 */
export declare function ZeroWidthPlugin({ textContent }: ZeroWidthPluginProps): null;
export {};
