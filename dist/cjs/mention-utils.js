"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LENGTH_LIMIT = exports.VALID_CHARS = exports.TRIGGERS = exports.PRE_TRIGGER_CHARS = exports.DEFAULT_PUNCTUATION = void 0;
exports.isWordChar = isWordChar;
exports.$getSelectionInfo = $getSelectionInfo;
exports.getNextSibling = getNextSibling;
exports.getPreviousSibling = getPreviousSibling;
exports.getTextContent = getTextContent;
exports.getCreatableProp = getCreatableProp;
exports.getMenuItemLimitProp = getMenuItemLimitProp;
exports.$selectEnd = $selectEnd;
exports.getTriggerRegExp = getTriggerRegExp;
const lexical_1 = require("lexical");
const ZeroWidthNode_1 = require("./ZeroWidthNode");
exports.DEFAULT_PUNCTUATION = "\\.,\\*\\?\\$\\|#{}\\(\\)\\^\\[\\]\\\\/!%'\"~=<>_:;";
// Makes it possible to use brackets before the trigger: (@mention)
exports.PRE_TRIGGER_CHARS = "\\(";
// Strings that can trigger the mention menu.
const TRIGGERS = (triggers) => "(?:" + triggers.join("|") + ")";
exports.TRIGGERS = TRIGGERS;
// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = (triggers, punctuation) => {
    const lookahead = triggers.length === 0 ? "" : "(?!" + triggers.join("|") + ")";
    return lookahead + "[^\\s" + punctuation + "]";
};
exports.VALID_CHARS = VALID_CHARS;
exports.LENGTH_LIMIT = 75;
function isWordChar(char, triggers, punctuation) {
    return new RegExp((0, exports.VALID_CHARS)(triggers, punctuation)).test(char);
}
function $getSelectionInfo(triggers, punctuation) {
    const selection = (0, lexical_1.$getSelection)();
    if (!selection || !(0, lexical_1.$isRangeSelection)(selection)) {
        return;
    }
    const anchor = selection.anchor;
    const focus = selection.focus;
    const nodes = selection.getNodes();
    if (anchor.key !== focus.key ||
        anchor.offset !== focus.offset ||
        nodes.length === 0) {
        return;
    }
    const [_node] = nodes;
    const node = (0, ZeroWidthNode_1.$isZeroWidthNode)(_node) ? _node.getPreviousSibling() : _node;
    if (!node) {
        return;
    }
    const isTextNode = (0, lexical_1.$isTextNode)(node) && node.isSimpleText();
    const offset = anchor.type === "text" ? anchor.offset : 0;
    const textContent = getTextContent(node);
    const cursorAtStartOfNode = offset === 0;
    const cursorAtEndOfNode = textContent.length === offset;
    const charBeforeCursor = textContent.charAt(offset - 1);
    const charAfterCursor = textContent.charAt(offset);
    const wordCharBeforeCursor = isWordChar(charBeforeCursor, triggers, punctuation);
    const wordCharAfterCursor = isWordChar(charAfterCursor, triggers, punctuation);
    const spaceBeforeCursor = /\s/.test(charBeforeCursor);
    const spaceAfterCursor = /\s/.test(charAfterCursor);
    const prevNode = getPreviousSibling(node);
    const nextNode = getNextSibling(node);
    const props = {
        node,
        offset,
        isTextNode,
        textContent,
        selection,
        prevNode,
        nextNode,
        cursorAtStartOfNode,
        cursorAtEndOfNode,
        wordCharBeforeCursor,
        wordCharAfterCursor,
        spaceBeforeCursor,
        spaceAfterCursor,
    };
    if (isTextNode) {
        return Object.assign(Object.assign({}, props), { isTextNode: true, node: node });
    }
    else {
        return Object.assign(Object.assign({}, props), { isTextNode: false, node: node });
    }
}
function getNextSibling(node) {
    let nextSibling = node.getNextSibling();
    while (nextSibling !== null && (0, ZeroWidthNode_1.$isZeroWidthNode)(nextSibling)) {
        nextSibling = nextSibling.getNextSibling();
    }
    return nextSibling;
}
function getPreviousSibling(node) {
    let previousSibling = node.getPreviousSibling();
    while (previousSibling !== null && (0, ZeroWidthNode_1.$isZeroWidthNode)(previousSibling)) {
        previousSibling = previousSibling.getPreviousSibling();
    }
    return previousSibling;
}
function getTextContent(node) {
    if ((0, ZeroWidthNode_1.$isZeroWidthNode)(node)) {
        return "";
    }
    return node.getTextContent();
}
function getCreatableProp(creatable, trigger) {
    if (typeof creatable === "string" || typeof creatable === "boolean") {
        return creatable;
    }
    if (trigger === null) {
        return false;
    }
    if (typeof creatable === "object") {
        return creatable[trigger];
    }
    return false;
}
function getMenuItemLimitProp(menuItemLimit, trigger) {
    if (typeof menuItemLimit === "number" || menuItemLimit === false) {
        return menuItemLimit;
    }
    if (typeof menuItemLimit === "undefined") {
        return 5;
    }
    if (trigger === null) {
        return false;
    }
    if (typeof menuItemLimit === "object") {
        return menuItemLimit[trigger];
    }
    return 5;
}
function getLastNode(root) {
    const descendant = root.getLastDescendant();
    if ((0, lexical_1.$isElementNode)(descendant) || (0, lexical_1.$isTextNode)(descendant)) {
        return descendant;
    }
    if ((0, lexical_1.$isDecoratorNode)(descendant)) {
        return descendant.getParent();
    }
    return root;
}
function $selectEnd() {
    const root = (0, lexical_1.$getRoot)();
    const lastNode = getLastNode(root);
    const key = lastNode && lastNode.getKey();
    const offset = (0, lexical_1.$isElementNode)(lastNode)
        ? lastNode.getChildrenSize()
        : (0, lexical_1.$isTextNode)(lastNode)
            ? getTextContent(lastNode).length
            : 0;
    const type = (0, lexical_1.$isElementNode)(lastNode) ? "element" : "text";
    if (key) {
        const newSelection = (0, lexical_1.$createRangeSelection)();
        newSelection.anchor.set(key, offset, type);
        newSelection.focus.set(key, offset, type);
        (0, lexical_1.$setSelection)(newSelection);
    }
}
function getTriggerRegExp(triggers, trigger) {
    for (const triggerRegExp of triggers) {
        const regex = new RegExp(triggerRegExp, "i");
        if (regex.test(trigger)) {
            return triggerRegExp;
        }
    }
    throw new Error(`No trigger found for match string: ${trigger}`);
}
