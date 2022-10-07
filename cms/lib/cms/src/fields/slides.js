"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHARING_SLIDE = exports.REFLECTION_SLIDE = exports.CONTENT_SLIDE = exports.PARTICIPANT_SPOTLIGHT_SLIDE = exports.SLIDE_TYPES = void 0;
const common_1 = require("./common");
exports.SLIDE_TYPES = {
    PARTICIPANT_SPOTLIGHT: 'participantSpotlight',
    CONTENT: 'content',
    REFLECTION: 'reflection',
    SHARING: 'sharing',
};
const CONTENT_VIDEO_FIELD = Object.assign(Object.assign({}, common_1.VIDEO_FIELD), { hint: 'Overrides image' });
const CONTENT_FIELDS = [
    {
        label: 'Heading',
        name: 'heading',
        widget: 'string',
        required: false,
    },
    {
        label: 'Text',
        name: 'text',
        widget: 'string',
        required: false,
    },
    common_1.IMAGE_FIELD,
    CONTENT_VIDEO_FIELD,
];
exports.PARTICIPANT_SPOTLIGHT_SLIDE = {
    label: 'Participant Spotlight',
    name: exports.SLIDE_TYPES.PARTICIPANT_SPOTLIGHT,
    widget: 'object',
    collapsed: true,
    fields: [
        {
            label: 'Content',
            name: 'content',
            widget: 'hidden',
            required: false,
        },
    ],
};
exports.CONTENT_SLIDE = {
    label: 'Content',
    name: exports.SLIDE_TYPES.CONTENT,
    widget: 'object',
    collapsed: true,
    fields: [
        {
            label: 'Content',
            name: 'content',
            widget: 'object',
            collapsed: false,
            fields: CONTENT_FIELDS,
        },
    ],
};
exports.REFLECTION_SLIDE = {
    label: 'Reflection',
    name: exports.SLIDE_TYPES.REFLECTION,
    widget: 'object',
    collapsed: true,
    fields: [
        {
            label: 'Content',
            name: 'content',
            widget: 'object',
            collapsed: false,
            fields: CONTENT_FIELDS,
        },
    ],
};
exports.SHARING_SLIDE = {
    label: 'Sharing',
    name: exports.SLIDE_TYPES.SHARING,
    widget: 'object',
    collapsed: true,
    fields: [
        {
            label: 'Content',
            name: 'content',
            widget: 'object',
            collapsed: false,
            fields: CONTENT_FIELDS,
        },
    ],
};
//# sourceMappingURL=slides.js.map