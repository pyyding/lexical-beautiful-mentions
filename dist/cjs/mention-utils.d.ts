import { LexicalNode, RangeSelection, TextNode } from "lexical";
import { BeautifulMentionsPluginProps } from "./BeautifulMentionsPluginProps";
interface SelectionInfoBase {
    offset: number;
    textContent: string;
    selection: RangeSelection;
    prevNode: LexicalNode | null;
    nextNode: LexicalNode | null;
    cursorAtStartOfNode: boolean;
    cursorAtEndOfNode: boolean;
    wordCharBeforeCursor: boolean;
    wordCharAfterCursor: boolean;
    spaceBeforeCursor: boolean;
    spaceAfterCursor: boolean;
}
interface TextNodeSelectionInfo extends SelectionInfoBase {
    isTextNode: true;
    node: TextNode;
}
interface LexicalNodeSelectionInfo extends SelectionInfoBase {
    isTextNode: false;
    node: LexicalNode;
}
type SelectionInfo = TextNodeSelectionInfo | LexicalNodeSelectionInfo | undefined;
export declare const DEFAULT_PUNCTUATION = "\\.,\\*\\?\\$\\|#{}\\(\\)\\^\\[\\]\\\\/!%'\"~=<>_:;";
export declare const PRE_TRIGGER_CHARS = "\\(";
export declare const TRIGGERS: (triggers: string[]) => string;
export declare const VALID_CHARS: (triggers: string[], punctuation: string) => string;
export declare const LENGTH_LIMIT = 75;
export declare function isWordChar(char: string, triggers: string[], punctuation: string): boolean;
export declare function $getSelectionInfo(triggers: string[], punctuation: string): SelectionInfo;
export declare function getNextSibling(node: LexicalNode): LexicalNode | null;
export declare function getPreviousSibling(node: LexicalNode): LexicalNode | null;
export declare function getTextContent(node: LexicalNode): string;
export declare function getCreatableProp(creatable: BeautifulMentionsPluginProps["creatable"], trigger: string | null): string | boolean;
export declare function getMenuItemLimitProp(menuItemLimit: BeautifulMentionsPluginProps["menuItemLimit"], trigger: string | null): number | false;
export declare function $selectEnd(): void;
export declare function getTriggerRegExp(triggers: string[], trigger: string): string;
export {};
