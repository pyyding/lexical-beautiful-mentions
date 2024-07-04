import { MenuTextMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { TextNode } from "lexical";
import { MutableRefObject } from "react";
import { BeautifulMentionsItemData } from "./BeautifulMentionsPluginProps";
export declare class MenuOption {
    /**
     * The menu item value. For example: "John".
     */
    readonly value: string;
    /**
     * The value to be displayed. Normally the same as `value` but can be
     * used to display a different value. For example: "Add 'John'".
     */
    readonly displayValue: string;
    /**
     * Additional data belonging to the option. For example: `{ id: 1 }`.
     */
    readonly data?: {
        [key: string]: BeautifulMentionsItemData;
    } | undefined;
    /**
     * Unique key to iterate over options. Equals to `data` if provided, otherwise
     * `value` is used.
     */
    readonly key: string;
    /**
     * Ref to the DOM element of the option.
     */
    ref?: MutableRefObject<HTMLElement | null>;
    constructor(
    /**
     * The menu item value. For example: "John".
     */
    value: string, 
    /**
     * The value to be displayed. Normally the same as `value` but can be
     * used to display a different value. For example: "Add 'John'".
     */
    displayValue: string, 
    /**
     * Additional data belonging to the option. For example: `{ id: 1 }`.
     */
    data?: {
        [key: string]: BeautifulMentionsItemData;
    } | undefined);
    setRefElement(element: HTMLElement | null): void;
}
/**
 * Split Lexical TextNode and return a new TextNode only containing matched text.
 * Common use cases include: removing the node, replacing with a new node.
 */
export declare function $splitNodeContainingQuery(match: MenuTextMatch): TextNode | null;
