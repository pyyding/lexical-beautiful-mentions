import { $createTextNode, $isParagraphNode, $isTextNode, $nodesOfType, $setSelection, createCommand, } from "lexical";
import { $getSelectionInfo, $selectEnd, getNextSibling, getPreviousSibling, getTextContent, getTriggerRegExp, } from "./mention-utils";
import { $createBeautifulMentionNode, BeautifulMentionNode, } from "./MentionNode";
export const INSERT_MENTION_COMMAND = createCommand("INSERT_MENTION_COMMAND");
export const REMOVE_MENTIONS_COMMAND = createCommand("REMOVE_MENTIONS_COMMAND");
export const RENAME_MENTIONS_COMMAND = createCommand("RENAME_MENTIONS_COMMAND");
export const OPEN_MENTION_MENU_COMMAND = createCommand("OPEN_MENTION_MENU_COMMAND");
export function $insertTriggerAtSelection(triggers, punctuation, trigger) {
    return $insertMentionOrTrigger(triggers, punctuation, trigger);
}
export function $insertMentionAtSelection(triggers, punctuation, trigger, value, data) {
    return $insertMentionOrTrigger(triggers, punctuation, trigger, value, data);
}
function $insertMentionOrTrigger(triggers, punctuation, trigger, value, data) {
    const selectionInfo = $getSelectionInfo(triggers, punctuation);
    if (!selectionInfo) {
        return false;
    }
    const { node, selection, wordCharBeforeCursor, wordCharAfterCursor, cursorAtStartOfNode, cursorAtEndOfNode, prevNode, nextNode, } = selectionInfo;
    const triggerRegExp = getTriggerRegExp(triggers, trigger);
    // Insert a mention node or a text node with the trigger to open the mention menu.
    const mentionNode = value
        ? $createBeautifulMentionNode(trigger, value, triggerRegExp, data)
        : $createTextNode(trigger);
    // Insert a mention with a leading space
    if (!($isParagraphNode(node) && cursorAtStartOfNode) && !$isTextNode(node)) {
        selection.insertNodes([$createTextNode(" "), mentionNode]);
        return true;
    }
    let spaceNode = null;
    const nodes = [];
    if (wordCharBeforeCursor ||
        (cursorAtStartOfNode && prevNode !== null && !$isTextNode(prevNode))) {
        nodes.push($createTextNode(" "));
    }
    nodes.push(mentionNode);
    if (wordCharAfterCursor ||
        (cursorAtEndOfNode && nextNode !== null && !$isTextNode(nextNode))) {
        spaceNode = $createTextNode(" ");
        nodes.push(spaceNode);
    }
    selection.insertNodes(nodes);
    if (nodes.length > 1) {
        if ($isTextNode(mentionNode)) {
            mentionNode.select();
        }
        else if (spaceNode) {
            spaceNode.selectPrevious();
        }
    }
    return true;
}
export function $removeMention(trigger, value, focus = true) {
    let removed = false;
    let prev = null;
    let next = null;
    const mentions = $nodesOfType(BeautifulMentionNode);
    for (const mention of mentions) {
        const sameTrigger = mention.getTrigger() === trigger;
        const sameValue = mention.getValue() === value;
        if (sameTrigger && (sameValue || !value)) {
            prev = getPreviousSibling(mention);
            next = getNextSibling(mention);
            mention.remove();
            removed = true;
            // Prevent double spaces
            if ($isTextNode(prev) &&
                getTextContent(prev).endsWith(" ") &&
                next &&
                getTextContent(next).startsWith(" ")) {
                prev.setTextContent(getTextContent(prev).slice(0, -1));
            }
            // Remove trailing space
            if (next === null &&
                $isTextNode(prev) &&
                getTextContent(prev).endsWith(" ")) {
                prev.setTextContent(getTextContent(prev).trimEnd());
            }
        }
    }
    if (removed && focus) {
        focusEditor(prev, next);
    }
    else if (!focus) {
        $setSelection(null);
    }
    return removed;
}
export function $renameMention(trigger, newValue, value, focus = true) {
    const mentions = $nodesOfType(BeautifulMentionNode);
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
        const prev = getPreviousSibling(renamedMention);
        const next = getNextSibling(renamedMention);
        focusEditor(prev, next);
        if (next && $isTextNode(next)) {
            next.select(0, 0);
        }
        else {
            $selectEnd();
        }
    }
    else if (!focus) {
        $setSelection(null);
    }
    return renamedMention !== null;
}
function focusEditor(prev, next) {
    if (next && $isTextNode(next)) {
        next.select(0, 0);
    }
    else if (prev && $isTextNode(prev)) {
        prev.select();
    }
    else {
        $selectEnd();
    }
}
