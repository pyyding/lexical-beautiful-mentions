"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OPEN_MENTION_MENU_COMMAND = exports.RENAME_MENTIONS_COMMAND = exports.REMOVE_MENTIONS_COMMAND = exports.INSERT_MENTION_COMMAND = void 0;
exports.$insertTriggerAtSelection = $insertTriggerAtSelection;
exports.$insertMentionAtSelection = $insertMentionAtSelection;
exports.$removeMention = $removeMention;
exports.$renameMention = $renameMention;
const lexical_1 = require("lexical");
const mention_utils_1 = require("./mention-utils");
const MentionNode_1 = require("./MentionNode");
exports.INSERT_MENTION_COMMAND = (0, lexical_1.createCommand)("INSERT_MENTION_COMMAND");
exports.REMOVE_MENTIONS_COMMAND = (0, lexical_1.createCommand)("REMOVE_MENTIONS_COMMAND");
exports.RENAME_MENTIONS_COMMAND = (0, lexical_1.createCommand)("RENAME_MENTIONS_COMMAND");
exports.OPEN_MENTION_MENU_COMMAND = (0, lexical_1.createCommand)("OPEN_MENTION_MENU_COMMAND");
function $insertTriggerAtSelection(triggers, punctuation, trigger) {
    return $insertMentionOrTrigger(triggers, punctuation, trigger);
}
function $insertMentionAtSelection(triggers, punctuation, trigger, value, data) {
    return $insertMentionOrTrigger(triggers, punctuation, trigger, value, data);
}
function $insertMentionOrTrigger(triggers, punctuation, trigger, value, data) {
    const selectionInfo = (0, mention_utils_1.$getSelectionInfo)(triggers, punctuation);
    if (!selectionInfo) {
        return false;
    }
    const { node, selection, wordCharBeforeCursor, wordCharAfterCursor, cursorAtStartOfNode, cursorAtEndOfNode, prevNode, nextNode, } = selectionInfo;
    const triggerRegExp = (0, mention_utils_1.getTriggerRegExp)(triggers, trigger);
    // Insert a mention node or a text node with the trigger to open the mention menu.
    const mentionNode = value
        ? (0, MentionNode_1.$createBeautifulMentionNode)(trigger, value, triggerRegExp, data)
        : (0, lexical_1.$createTextNode)(trigger);
    // Insert a mention with a leading space
    if (!((0, lexical_1.$isParagraphNode)(node) && cursorAtStartOfNode) && !(0, lexical_1.$isTextNode)(node)) {
        selection.insertNodes([(0, lexical_1.$createTextNode)(" "), mentionNode]);
        return true;
    }
    let spaceNode = null;
    const nodes = [];
    if (wordCharBeforeCursor ||
        (cursorAtStartOfNode && prevNode !== null && !(0, lexical_1.$isTextNode)(prevNode))) {
        nodes.push((0, lexical_1.$createTextNode)(" "));
    }
    nodes.push(mentionNode);
    if (wordCharAfterCursor ||
        (cursorAtEndOfNode && nextNode !== null && !(0, lexical_1.$isTextNode)(nextNode))) {
        spaceNode = (0, lexical_1.$createTextNode)(" ");
        nodes.push(spaceNode);
    }
    selection.insertNodes(nodes);
    if (nodes.length > 1) {
        if ((0, lexical_1.$isTextNode)(mentionNode)) {
            mentionNode.select();
        }
        else if (spaceNode) {
            spaceNode.selectPrevious();
        }
    }
    return true;
}
function $removeMention(trigger, value, focus = true) {
    let removed = false;
    let prev = null;
    let next = null;
    const mentions = (0, lexical_1.$nodesOfType)(MentionNode_1.BeautifulMentionNode);
    for (const mention of mentions) {
        const sameTrigger = mention.getTrigger() === trigger;
        const sameValue = mention.getValue() === value;
        if (sameTrigger && (sameValue || !value)) {
            prev = (0, mention_utils_1.getPreviousSibling)(mention);
            next = (0, mention_utils_1.getNextSibling)(mention);
            mention.remove();
            removed = true;
            // Prevent double spaces
            if ((0, lexical_1.$isTextNode)(prev) &&
                (0, mention_utils_1.getTextContent)(prev).endsWith(" ") &&
                next &&
                (0, mention_utils_1.getTextContent)(next).startsWith(" ")) {
                prev.setTextContent((0, mention_utils_1.getTextContent)(prev).slice(0, -1));
            }
            // Remove trailing space
            if (next === null &&
                (0, lexical_1.$isTextNode)(prev) &&
                (0, mention_utils_1.getTextContent)(prev).endsWith(" ")) {
                prev.setTextContent((0, mention_utils_1.getTextContent)(prev).trimEnd());
            }
        }
    }
    if (removed && focus) {
        focusEditor(prev, next);
    }
    else if (!focus) {
        (0, lexical_1.$setSelection)(null);
    }
    return removed;
}
function $renameMention(trigger, newValue, value, focus = true) {
    const mentions = (0, lexical_1.$nodesOfType)(MentionNode_1.BeautifulMentionNode);
    let renamedMention = null;
    for (const mention of mentions) {
        const sameTrigger = mention.getTrigger() === trigger;
        const sameValue = mention.getValue() === value;
        if (sameTrigger && (sameValue || !value)) {
            renamedMention = mention;
            mention.setValue(newValue);
        }
    }
    if (renamedMention && focus) {
        const prev = (0, mention_utils_1.getPreviousSibling)(renamedMention);
        const next = (0, mention_utils_1.getNextSibling)(renamedMention);
        focusEditor(prev, next);
        if (next && (0, lexical_1.$isTextNode)(next)) {
            next.select(0, 0);
        }
        else {
            (0, mention_utils_1.$selectEnd)();
        }
    }
    else if (!focus) {
        (0, lexical_1.$setSelection)(null);
    }
    return renamedMention !== null;
}
function focusEditor(prev, next) {
    if (next && (0, lexical_1.$isTextNode)(next)) {
        next.select(0, 0);
    }
    else if (prev && (0, lexical_1.$isTextNode)(prev)) {
        prev.select();
    }
    else {
        (0, mention_utils_1.$selectEnd)();
    }
}
