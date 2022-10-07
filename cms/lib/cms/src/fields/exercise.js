"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = require("../../../shared/src/constants/colors");
const common_1 = require("./common");
const slides_1 = require("./slides");
const INTRO_PORTAL = {
    label: 'Intro Portal',
    name: 'introPortal',
    widget: 'object',
    collapsed: true,
    required: false,
    i18n: true,
    fields: [
        Object.assign(Object.assign({}, common_1.VIDEO_FIELD), { label: 'Video Loop', name: 'videoLoop' }),
        Object.assign(Object.assign({}, common_1.VIDEO_FIELD), { label: 'Video End', name: 'videoEnd' }),
    ],
};
const THEME = {
    label: 'Theme',
    name: 'theme',
    widget: 'object',
    collapsed: true,
    required: false,
    i18n: true,
    fields: [
        {
            label: 'Text Color',
            name: 'textColor',
            widget: 'select',
            multiple: false,
            i18n: 'duplicate',
            default: colors_1.COLORS.ACTION,
            options: [
                { label: 'Light', value: colors_1.COLORS.WHITE },
                { label: 'Dark', value: colors_1.COLORS.BLACK },
            ],
            required: true,
        },
        {
            label: 'Background Color',
            name: 'backgroundColor',
            widget: 'color',
            i18n: 'duplicate',
            required: true,
        },
    ],
};
const EXERCISE_FIELDS = [
    common_1.ID_FIELD,
    common_1.NAME_FIELD,
    common_1.PUBLISHED_FIELD,
    common_1.CARD_FIELD,
    THEME,
    INTRO_PORTAL,
    {
        label: 'Slides',
        name: 'slides',
        widget: 'list',
        i18n: true,
        types: [
            slides_1.CONTENT_SLIDE,
            slides_1.REFLECTION_SLIDE,
            slides_1.SHARING_SLIDE,
            slides_1.PARTICIPANT_SPOTLIGHT_SLIDE,
        ],
    },
];
exports.default = EXERCISE_FIELDS;
//# sourceMappingURL=exercise.js.map