"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var types_1 = require("../types");
var defaultRegisterOptions = {
    maxLength: 1,
    required: false,
};
var SPECIAL_KEYS = [types_1.KeyCodes.ARROW_LEFT, types_1.KeyCodes.ARROW_RIGHT, types_1.KeyCodes.BACKSPACE, types_1.KeyCodes.SPACEBAR, types_1.KeyCodes.ENTER];
var TYPE_MAP = {
    'numeric': 'tel',
    'alphanumeric': 'text',
    'password': 'password',
    'password-numeric': 'password'
};
var useOtpInput = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.type, type = _c === void 0 ? 'alphanumeric' : _c, onInputValueChange = _b.onInputValueChange, _d = _b.blankAllowed, blankAllowed = _d === void 0 ? false : _d, _e = _b.focusOnLoad, focusOnLoad = _e === void 0 ? false : _e, _f = _b.autoCompleteAttribute, autoCompleteAttribute = _f === void 0 ? "off" : _f, defaultInlineStyles = _b.defaultInlineStyles, _g = _b.cycle, cycle = _g === void 0 ? false : _g, _h = _b.placeholder, placeholder = _h === void 0 ? '' : _h, numberOfInputs = _b.numberOfInputs;
    var mainRef = (0, react_1.useRef)({
        fields: [],
        uniqueNames: [],
        currentActiveInputIndex: 0,
        value: type === "numeric" ? 0 : "",
        totalInputValueLength: 0,
    });
    var _j = (0, react_1.useState)(""), value = _j[0], setValueState = _j[1];
    var _k = (0, react_1.useState)(""), error = _k[0], setError = _k[1];
    var focusInputField = function (currentActiveIndex) {
        var fields = mainRef.current.fields;
        if (isValidFieldIndex(currentActiveIndex)) {
            fields[currentActiveIndex].element.focus();
            return fields[currentActiveIndex];
        }
    };
    var isValidFieldIndex = function (currentActiveIndex) {
        var fields = mainRef.current.fields;
        return currentActiveIndex < fields.length && currentActiveIndex >= 0;
    };
    var handleKeyCodes = function (e) {
        var key = e.key;
        if (key === types_1.KeyCodes.ARROW_LEFT) {
            focusInputField(getPrevIndex());
        }
        else if (key === types_1.KeyCodes.ARROW_RIGHT) {
            focusInputField(getNextIndex());
        }
        else if (key === types_1.KeyCodes.BACKSPACE) {
            focusInputField(getPrevIndex());
        }
        else if (key === types_1.KeyCodes.SPACEBAR) {
            e.preventDefault();
        }
    };
    var getNextIndex = function () {
        var idx = mainRef.current.currentActiveInputIndex;
        mainRef.current.currentActiveInputIndex = isValidFieldIndex(idx + 1) ? idx + 1 : cycle ? 0 : idx;
        return mainRef.current.currentActiveInputIndex;
    };
    var getPrevIndex = function () {
        var idx = mainRef.current.currentActiveInputIndex;
        mainRef.current.currentActiveInputIndex = isValidFieldIndex(idx - 1) ? idx - 1 : cycle ? mainRef.current.fields.length - 1 : idx;
        return mainRef.current.currentActiveInputIndex;
    };
    (0, react_1.useLayoutEffect)(function () {
        if (focusOnLoad) {
            try {
                mainRef.current.fields[0].element.focus();
            }
            catch (e) {
                console.error("Cannot find field on load");
            }
        }
        mainRef.current.totalInputValueLength = mainRef.current.fields.reduce(function (acc, input) {
            acc += input.maxLength;
            return acc;
        }, 0);
    }, []);
    var isInputTextSelected = function (input) {
        if (typeof input.selectionStart == "number") {
            return (input.selectionStart == 0 && input.selectionEnd == input.value.length);
        }
        return false;
    };
    var fillInputValue = function (startIndex, val) {
        if (startIndex === void 0) { startIndex = 0; }
        if (val) {
            var numberOfInputs_1 = mainRef.current.fields.length;
            var remainingValue = val.toString().slice(0, numberOfInputs_1);
            var inputTextLength = remainingValue.length;
            var finalValue = remainingValue;
            for (var i = startIndex; i < Math.min(numberOfInputs_1, inputTextLength); i++) {
                var inputFields = mainRef.current.fields;
                var max = inputFields[i].maxLength;
                inputFields[i].element.value = remainingValue.slice(0, max);
                remainingValue = remainingValue.slice(max);
            }
            setValueState(finalValue);
            mainRef.current.value = finalValue;
        }
    };
    return {
        register: function (name, options) {
            if (options === void 0) { options = defaultRegisterOptions; }
            var inputMaxLength = options.maxLength ? options.maxLength : 1;
            return {
                autoComplete: autoCompleteAttribute,
                "aria-label": "otp-input-".concat(name),
                name: "otp-input-".concat(name),
                onKeyDown: function (e) {
                    var value = e.target.value;
                    var key = e.key;
                    if (!blankAllowed && key === types_1.KeyCodes.SPACEBAR) {
                        e.preventDefault();
                    }
                    if ((value.length >= inputMaxLength &&
                        key !== types_1.KeyCodes.BACKSPACE && key !== types_1.KeyCodes.ENTER &&
                        !isInputTextSelected(e.target))) {
                        e.preventDefault();
                    }
                    if ((type === 'numeric' || type === 'password-numeric') && !(/^[\d]$/.test(key)) && !SPECIAL_KEYS.includes(key)) {
                        e.preventDefault();
                    }
                },
                onInput: function (e) {
                    var value = e.target.value;
                    if (value.length >= inputMaxLength && value !== "") {
                        focusInputField(getNextIndex());
                    }
                    mainRef.current.value = mainRef.current.fields
                        .map(function (input) { return input.element.value; })
                        .join("");
                    if (onInputValueChange) {
                        onInputValueChange(mainRef.current.value);
                    }
                    setValueState(mainRef.current.value);
                },
                onKeyUp: function (e) {
                    var value = e.target.value;
                    var key = e.key;
                    if (value.length === 0 ||
                        key === types_1.KeyCodes.ARROW_LEFT ||
                        key === types_1.KeyCodes.ARROW_RIGHT) {
                        handleKeyCodes(e);
                    }
                },
                onFocus: function (e) {
                    mainRef.current.currentActiveInputIndex =
                        mainRef.current.fields.findIndex(function (inputEl) { return inputEl.element === e.target; });
                    e.target.setSelectionRange(0, inputMaxLength);
                },
                ref: (0, react_1.useCallback)(function (fieldRef) {
                    if (fieldRef) {
                        var indirectInputRef = fieldRef.querySelector("input,textarea");
                        if (indirectInputRef) {
                            fieldRef = indirectInputRef;
                        }
                        if (options.required) {
                            fieldRef.required = options.required;
                        }
                        fieldRef.maxLength = inputMaxLength;
                        mainRef.current.uniqueNames.push(name);
                        if (fieldRef instanceof HTMLInputElement) {
                            fieldRef.type = TYPE_MAP[type];
                        }
                        mainRef.current.fields.push({
                            element: fieldRef,
                            inputName: name,
                            maxLength: inputMaxLength
                        });
                    }
                }, []),
                style: defaultInlineStyles,
                placeholder: placeholder,
                onPaste: function (e) {
                    var paste = e.clipboardData.getData("text");
                    fillInputValue(mainRef.current.currentActiveInputIndex, paste);
                    var numberOfInputs = mainRef.current.fields.length;
                }
            };
        },
        setValue: function (val) {
            fillInputValue(0, val);
        },
        setDisabled: function (disabled) {
            mainRef.current.fields.forEach(function (input) {
                input.element.disabled = disabled;
            });
        },
        clear: function () {
            mainRef.current.currentActiveInputIndex = 0;
            mainRef.current.fields[mainRef.current.currentActiveInputIndex].element.focus();
            mainRef.current.fields.forEach(function (input) {
                input.element.value = "";
            });
            setValueState("");
        },
        value: value,
        get inputs() {
            var inputProps = [];
            if (typeof numberOfInputs === 'number' && numberOfInputs > 0) {
                for (var i = 0; i < numberOfInputs; i++) {
                    inputProps.push(this.register("num-".concat(i)));
                }
                return inputProps;
            }
            else {
                console.warn('Please provide `numOfInputs` to use the input array map');
                return [];
            }
        },
        error: error,
        setError: setError
    };
};
exports.default = useOtpInput;
