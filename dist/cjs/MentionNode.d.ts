import { DOMConversionMap, DOMExportOutput, DecoratorNode, LexicalEditor, SerializedLexicalNode, Spread, type EditorConfig, type LexicalNode, type NodeKey } from "lexical";
import React, { ElementType } from "react";
import { BeautifulMentionComponentProps, BeautifulMentionsItemData } from "./BeautifulMentionsPluginProps";
export type SerializedBeautifulMentionNode = Spread<{
    trigger: string;
    triggerRegExp: string;
    value: string;
    data?: {
        [p: string]: BeautifulMentionsItemData;
    };
}, SerializedLexicalNode>;
/**
 * This node is used to represent a mention used in the BeautifulMentionPlugin.
 */
export declare class BeautifulMentionNode extends DecoratorNode<React.JSX.Element> {
    __trigger: string;
    __triggerRegExp: string;
    __value: string;
    __data?: {
        [p: string]: BeautifulMentionsItemData;
    };
    static getType(): string;
    static clone(node: BeautifulMentionNode): BeautifulMentionNode;
    constructor(trigger: string, triggerRegExp: string, value: string, data?: {
        [p: string]: BeautifulMentionsItemData;
    }, key?: NodeKey);
    createDOM(): HTMLElement;
    updateDOM(): boolean;
    exportDOM(): DOMExportOutput;
    static importDOM(): DOMConversionMap | null;
    static importJSON(serializedNode: SerializedBeautifulMentionNode): BeautifulMentionNode;
    exportJSON(): SerializedBeautifulMentionNode;
    getTextContent(): string;
    getTrigger(): string;
    getTriggerRegExp(): string;
    getValue(): string;
    setValue(value: string): void;
    getData(): {
        [p: string]: BeautifulMentionsItemData;
    } | undefined;
    setData(data?: {
        [p: string]: BeautifulMentionsItemData;
    }): void;
    component(): ElementType<BeautifulMentionComponentProps> | null;
    decorate(_editor: LexicalEditor, config: EditorConfig): React.JSX.Element;
    getCssClassesFromTheme(config: EditorConfig): {
        className: string | undefined;
        classNameFocused: string | undefined;
        classNames: import("./theme").BeautifulMentionsCssClassNames | undefined;
    };
}
export declare function $createBeautifulMentionNode(trigger: string, triggerRegExp: string, value: string, data?: {
    [p: string]: BeautifulMentionsItemData;
}): BeautifulMentionNode;
export declare function $isBeautifulMentionNode(node: LexicalNode | null | undefined): node is BeautifulMentionNode;
