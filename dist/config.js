/**
 * todo: giga hack #1 - this should not be here. the regexes should be part of plugin's triggers prop.
 */
export const regexes = [
    "by(\\s)?((monday|tuesday|wednesday|today|tomorrow)|(\\d(-|\\/)\\d(-|\\/)\\d))?",
    "on(\\s)?((monday|tuesday|wednesday)|(\\d(-|\\/)\\d(-|\\/)\\d))?",
    "in(\\s)?(\\d(\\s)?(days|weeks|months))?",
    "with(\\s)?",
    "#",
    "this(\\s)?(monday|tuesday|wednesday|month|quarter)?",
    "next(\\s)?(monday|tuesday|wednesday|month|quarter)?",
    "from(\\s)?((monday|tuesday|wednesday)|(\\d(-|\\/)\\d(-|\\/)\\d))?",
    "to(\\s)?((monday|tuesday|wednesday)|(\\d(-|\\/)\\d(-|\\/)\\d))?",
    "until(\\s)?((monday|tuesday|wednesday)|(\\d(-|\\/)\\d(-|\\/)\\d))?",
    "every(\\s)?((day|year|month|quarter|week))?",
    "for(\\s)?",
];
