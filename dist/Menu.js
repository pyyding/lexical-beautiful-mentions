import { $getSelection, $isRangeSelection } from "lexical";
import { getTextContent } from "./mention-utils";
export class MenuOption {
    constructor(
    /**
     * The menu item value. For example: "John".
     */
    value, 
    /**
     * The value to be displayed. Normally the same as `value` but can be
     * used to display a different value. For example: "Add 'John'".
     */
    displayValue, 
    /**
     * Additional data belonging to the option. For example: `{ id: 1 }`.
     */
    data) {
        this.value = value;
        this.displayValue = displayValue;
        this.data = data;
        this.key = !data ? value : JSON.stringify(Object.assign(Object.assign({}, data), { value }));
        this.displayValue = displayValue !== null && displayValue !== void 0 ? displayValue : value;
        this.ref = { current: null };
        this.setRefElement = this.setRefElement.bind(this);
    }
    setRefElement(element) {
        this.ref = { current: element };
    }
}
/**
 * Split Lexical TextNode and return a new TextNode only containing matched text.
 * Common use cases include: removing the node, replacing with a new node.
 */
export function $splitNodeContainingQuery(match) {
    const selection = $getSelection();
    if (!$isRangeSelection(selection) || !selection.isCollapsed()) {
        return null;
    }
    const anchor = selection.anchor;
    if (anchor.type !== "text") {
        return null;
    }
    const anchorNode = anchor.getNode();
    if (!anchorNode.isSimpleText()) {
        return null;
    }
    const selectionOffset = anchor.offset;
    const textContent = getTextContent(anchorNode).slice(0, selectionOffset);
    const characterOffset = match.replaceableString.length;
    const queryOffset = getFullMatchOffset(textContent, match.matchingString, characterOffset);
    const startOffset = selectionOffset - queryOffset;
    if (startOffset < 0) {
        return null;
    }
    let newNode;
    if (startOffset === 0) {
        [newNode] = anchorNode.splitText(selectionOffset);
    }
    else {
        [, newNode] = anchorNode.splitText(startOffset, selectionOffset);
    }
    return newNode;
}
/**
 * Walk backwards along user input and forward through entity title to try
 * and replace more of the user's text with entity.
 */
function getFullMatchOffset(documentText, entryText, offset) {
    let triggerOffset = offset;
    for (let i = triggerOffset; i <= entryText.length; i++) {
        if (documentText.substring(-i) === entryText.substring(0, i)) {
            triggerOffset = i;
        }
    }
    return triggerOffset;
}
