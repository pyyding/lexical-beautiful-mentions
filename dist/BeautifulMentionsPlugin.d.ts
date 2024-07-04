import { MenuTextMatch } from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { BeautifulMentionsPluginProps } from "./BeautifulMentionsPluginProps";
export declare function checkForMentions(text: string, triggers: string[], preTriggerChars: string, punctuation: string, allowSpaces: boolean): MenuTextMatch | null;
/**
 * A plugin that adds mentions to the lexical editor.
 */
export declare function BeautifulMentionsPlugin(props: BeautifulMentionsPluginProps): import("react/jsx-runtime").JSX.Element | null;
