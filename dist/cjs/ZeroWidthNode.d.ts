import { DOMConversionMap, DOMExportOutput, LexicalEditor, TextNode, type LexicalNode, type NodeKey, type SerializedTextNode } from "lexical";
export type SerializedZeroWidthNode = SerializedTextNode;
export declare class ZeroWidthNode extends TextNode {
    private __textContent;
    static getType(): string;
    static clone(node: ZeroWidthNode): ZeroWidthNode;
    static importJSON(_: SerializedZeroWidthNode): ZeroWidthNode;
    constructor(__textContent: string, key?: NodeKey);
    exportJSON(): SerializedZeroWidthNode;
    updateDOM(): boolean;
    static importDOM(): DOMConversionMap | null;
    exportDOM(editor: LexicalEditor): DOMExportOutput;
    isTextEntity(): boolean;
    getTextContent(): string;
}
export declare function $createZeroWidthNode(textContent?: string): ZeroWidthNode;
export declare function $isZeroWidthNode(node: LexicalNode | null | undefined): node is ZeroWidthNode;
