"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Control = exports.Widget = void 0;
const react_1 = __importStar(require("react"));
const uuid_1 = require("uuid");
class Control extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.generateId = () => {
            const { onChange } = this.props;
            const id = (0, uuid_1.v4)();
            onChange(id);
        };
        this.componentDidUpdate = () => {
            const { value } = this.props;
            if (!value)
                this.generateId();
        };
        if (!props.value)
            this.generateId();
    }
    render() {
        const { forID, classNameWrapper, setActiveStyle, setInactiveStyle, value } = this.props;
        return (react_1.default.createElement("input", { type: "text", className: classNameWrapper, style: {
                color: '#cdcdcd',
            }, value: value || '', id: forID, onFocus: setActiveStyle, onBlur: setInactiveStyle, disabled: true }));
    }
}
exports.Control = Control;
const Widget = {
    name: 'uniqueId',
    controlComponent: react_1.Component,
};
exports.Widget = Widget;
//# sourceMappingURL=uniqueIdWidget.js.map