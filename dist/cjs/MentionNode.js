"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BeautifulMentionNode = void 0;
exports.$createBeautifulMentionNode = $createBeautifulMentionNode;
exports.$isBeautifulMentionNode = $isBeautifulMentionNode;
const jsx_runtime_1 = require("react/jsx-runtime");
const lexical_1 = require("lexical");
const MentionComponent_1 = __importDefault(require("./MentionComponent"));
function convertElement(domNode) {
    const trigger = domNode.getAttribute("data-lexical-beautiful-mention-trigger");
    const triggerRegExp = domNode.getAttribute("data-lexical-beautiful-mention-trigger-regexp");
    const value = domNode.getAttribute("data-lexical-beautiful-mention-value");
    let data = undefined;
    const dataStr = domNode.getAttribute("data-lexical-beautiful-mention-data");
    if (dataStr) {
        try {
            data = JSON.parse(dataStr);
        }
        catch (e) {
            console.warn("Failed to parse data attribute of beautiful mention node", e);
        }
    }
    if (trigger != null && value !== null && triggerRegExp !== null) {
        const node = $createBeautifulMentionNode(trigger, value, triggerRegExp, data);
        return { node };
    }
    return null;
}
/**
 * This node is used to represent a mention used in the BeautifulMentionPlugin.
 */
class BeautifulMentionNode extends lexical_1.DecoratorNode {
    static getType() {
        return "beautifulMention";
    }
    static clone(node) {
        return new BeautifulMentionNode(node.__trigger, node.__triggerRegExp, node.__value, node.__data, node.__key);
    }
    constructor(trigger, triggerRegExp, value, data, key) {
        super(key);
        this.__trigger = applySpaceToTriggerIfNeeded(trigger, triggerRegExp);
        this.__triggerRegExp = triggerRegExp;
        this.__value = value;
        this.__data = data;
    }
    createDOM() {
        return document.createElement("span");
    }
    updateDOM() {
        return false;
    }
    exportDOM() {
        const element = document.createElement("span");
        element.setAttribute("data-lexical-beautiful-mention", "true");
        element.setAttribute("data-lexical-beautiful-mention-trigger", this.__trigger);
        element.setAttribute("data-lexical-beautiful-mention-trigger-regexp", this.__triggerRegExp);
        element.setAttribute("data-lexical-beautiful-mention-value", this.__value);
        if (this.__data) {
            element.setAttribute("data-lexical-beautiful-mention-data", JSON.stringify(this.__data));
        }
        element.textContent = this.getTextContent();
        return { element };
    }
    static importDOM() {
        return {
            span: (domNode) => {
                if (!domNode.hasAttribute("data-lexical-beautiful-mention")) {
                    return null;
                }
                return {
                    conversion: convertElement,
                    priority: 1,
                };
            },
        };
    }
    static importJSON(serializedNode) {
        return $createBeautifulMentionNode(serializedNode.trigger, serializedNode.triggerRegExp, serializedNode.value, serializedNode.data);
    }
    exportJSON() {
        const data = this.__data;
        return Object.assign(Object.assign({ trigger: this.__trigger, triggerRegExp: this.__triggerRegExp, value: this.__value }, (data ? { data } : {})), { type: "beautifulMention", version: 1 });
    }
    getTextContent() {
        const self = this.getLatest();
        return self.__trigger + self.__value;
    }
    getTrigger() {
        const self = this.getLatest();
        return self.__trigger;
    }
    getTriggerRegExp() {
        const self = this.getLatest();
        return self.__triggerRegExp;
    }
    getValue() {
        const self = this.getLatest();
        return self.__value;
    }
    setValue(value) {
        const self = this.getWritable();
        self.__value = value;
    }
    getData() {
        const self = this.getLatest();
        return self.__data;
    }
    setData(data) {
        const self = this.getWritable();
        self.__data = data;
    }
    component() {
        return null;
    }
    decorate(_editor, config) {
        const { className, classNameFocused, classNames } = this.getCssClassesFromTheme(config);
        return ((0, jsx_runtime_1.jsx)(MentionComponent_1.default, { nodeKey: this.getKey(), trigger: this.getTrigger(), value: this.getValue(), data: this.getData(), className: className, classNameFocused: classNameFocused, classNames: classNames, component: this.component() }));
    }
    getCssClassesFromTheme(config) {
        const theme = config.theme.beautifulMentions || {};
        const themeEntry = Object.entries(theme).find(([trigger]) => new RegExp(trigger).test(this.__trigger));
        const key = themeEntry && themeEntry[0];
        const value = themeEntry && themeEntry[1];
        const className = typeof value === "string" ? value : undefined;
        const classNameFocused = className && typeof theme[key + "Focused"] === "string"
            ? theme[key + "Focused"]
            : undefined;
        const classNames = themeEntry && typeof value !== "string" ? value : undefined;
        return {
            className,
            classNameFocused,
            classNames,
        };
    }
}
exports.BeautifulMentionNode = BeautifulMentionNode;
function $createBeautifulMentionNode(trigger, triggerRegExp, value, data) {
    const mentionNode = new BeautifulMentionNode(trigger, triggerRegExp, value, data);
    return (0, lexical_1.$applyNodeReplacement)(mentionNode);
}
function $isBeautifulMentionNode(node) {
    return node instanceof BeautifulMentionNode;
}
function applySpaceToTriggerIfNeeded(trigger, triggerRegExp) {
    if (triggerRegExp.endsWith("\\s?") && !trigger.endsWith(" ")) {
        return `${trigger} `;
    }
    return trigger;
}
