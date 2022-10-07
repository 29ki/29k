"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CARD_FIELD = exports.VIDEO_FIELD = exports.IMAGE_FIELD = exports.NAME_FIELD = exports.PUBLISHED_FIELD = exports.ID_FIELD = void 0;
exports.ID_FIELD = {
    label: 'ID',
    name: 'id',
    widget: 'uniqueId',
    i18n: 'duplicate',
    required: true,
    index_file: '',
    meta: false,
};
exports.PUBLISHED_FIELD = {
    label: 'Published',
    name: 'published',
    widget: 'boolean',
    required: true,
    default: false,
    i18n: true,
};
exports.NAME_FIELD = {
    label: 'Name',
    name: 'name',
    i18n: true,
    widget: 'string',
};
exports.IMAGE_FIELD = {
    label: 'Image',
    name: 'image',
    widget: 'object',
    required: false,
    i18n: true,
    fields: [
        {
            label: 'Description',
            name: 'description',
            widget: 'string',
            required: false,
            i18n: true,
        },
        {
            label: 'Image file',
            name: 'source',
            widget: 'image',
            required: false,
            i18n: true,
        },
    ],
};
exports.VIDEO_FIELD = {
    label: 'Video',
    name: 'video',
    widget: 'object',
    collapsed: true,
    required: false,
    i18n: true,
    fields: [
        {
            label: 'Description',
            name: 'description',
            widget: 'string',
            required: false,
            i18n: true,
        },
        {
            label: 'Video file',
            name: 'source',
            widget: 'file',
            required: false,
            i18n: true,
        },
        {
            label: 'Preview image',
            name: 'preview',
            widget: 'image',
            required: false,
            i18n: false,
        },
    ],
};
exports.CARD_FIELD = {
    label: 'Card',
    name: 'card',
    i18n: true,
    widget: 'object',
    collapsed: true,
    fields: [exports.IMAGE_FIELD],
};
//# sourceMappingURL=common.js.map