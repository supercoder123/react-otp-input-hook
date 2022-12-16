import { useEffect, useRef, useState, useCallback } from "react";
import { KeyCodes, } from "../types";
const defaultRegisterOptions = {
    maxLength: 1,
    required: false,
};
const focusInputField = (fields, currentActiveIndex) => {
    if (isValidFieldIndex(fields, currentActiveIndex)) {
        fields[currentActiveIndex].element.focus();
        return fields[currentActiveIndex];
    }
};
const isValidFieldIndex = (fields, currentActiveIndex) => {
    return currentActiveIndex < fields.length && currentActiveIndex >= 0;
};
const isValidInput = (value) => {
    return ![
        "",
        KeyCodes.ARROW_LEFT,
        KeyCodes.ARROW_RIGHT,
        KeyCodes.BACKSPACE,
        KeyCodes.ENTER,
        KeyCodes.SPACEBAR
    ].includes(value);
};
const SPECIAL_KEYS = [KeyCodes.ARROW_LEFT, KeyCodes.ARROW_RIGHT, KeyCodes.BACKSPACE, KeyCodes.SPACEBAR, KeyCodes.ENTER];
const TYPE_MAP = {
    'numeric': 'tel',
    'alphanumeric': 'text',
    'password': 'password',
    'password-numeric': 'password'
};
const useOtpInput = ({ type = 'alphanumeric', onInputValueChange, blankAllowed = false, focusOnLoad = false, autoCompleteAttribute = "off", defaultInlineStyles, cycle = false, placeholder = '', numberOfInputs } = {}) => {
    const mainRef = useRef({
        fields: [],
        uniqueNames: [],
        currentActiveInputIndex: 0,
        value: type === "numeric" ? 0 : "",
        totalInputValueLength: 0,
    });
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const handleKeyCodes = (e) => {
        const key = e.key;
        if (key === KeyCodes.ARROW_LEFT) {
            focusInputField(mainRef.current.fields, getPrevIndex());
        }
        else if (key === KeyCodes.ARROW_RIGHT) {
            focusInputField(mainRef.current.fields, getNextIndex());
        }
        else if (key === KeyCodes.BACKSPACE) {
            focusInputField(mainRef.current.fields, getPrevIndex());
        }
        else if (key === KeyCodes.SPACEBAR) {
            e.preventDefault();
        }
    };
    const getNextIndex = () => {
        const idx = mainRef.current.currentActiveInputIndex;
        mainRef.current.currentActiveInputIndex = isValidFieldIndex(mainRef.current.fields, idx + 1)
            ? idx + 1
            : cycle ? 0 : idx;
        return mainRef.current.currentActiveInputIndex;
    };
    const getPrevIndex = () => {
        const idx = mainRef.current.currentActiveInputIndex;
        mainRef.current.currentActiveInputIndex = isValidFieldIndex(mainRef.current.fields, idx - 1)
            ? idx - 1
            : cycle ? mainRef.current.fields.length - 1 : idx;
        return mainRef.current.currentActiveInputIndex;
    };
    useEffect(() => {
        if (focusOnLoad) {
            try {
                mainRef.current.fields[0].element.focus();
            }
            catch (e) {
                console.error("Cannot find field on load");
            }
        }
        mainRef.current.totalInputValueLength = mainRef.current.fields.reduce((acc, input) => {
            acc += input.maxLength;
            return acc;
        }, 0);
    }, []);
    const isInputTextSelected = (input) => {
        if (typeof input.selectionStart == "number") {
            return (input.selectionStart == 0 && input.selectionEnd == input.value.length);
        }
        return false;
    };
    return {
        register: (name, options = defaultRegisterOptions) => {
            const inputMaxLength = options.maxLength ? options.maxLength : 1;
            return {
                autoComplete: autoCompleteAttribute,
                "aria-label": `otp-input-${name}`,
                onKeyDown: (e) => {
                    const value = e.target.value;
                    const key = e.key;
                    if (!blankAllowed && key === KeyCodes.SPACEBAR) {
                        e.preventDefault();
                    }
                    if ((value.length >= inputMaxLength &&
                        key !== KeyCodes.BACKSPACE && key !== KeyCodes.ENTER &&
                        !isInputTextSelected(e.target))) {
                        e.preventDefault();
                    }
                    if ((type === 'numeric' || type === 'password-numeric') && !(/^[\d]$/.test(key)) && !SPECIAL_KEYS.includes(key)) {
                        e.preventDefault();
                    }
                },
                onInput: (e) => {
                    const value = e.target.value;
                    if (value.length >= inputMaxLength && value !== "") {
                        focusInputField(mainRef.current.fields, getNextIndex());
                    }
                    mainRef.current.value = mainRef.current.fields
                        .map((input) => input.element.value)
                        .join("");
                    if (onInputValueChange) {
                        onInputValueChange(mainRef.current.value);
                    }
                    setValue(mainRef.current.value);
                },
                onKeyUp: (e) => {
                    e.preventDefault();
                    const value = e.target.value;
                    const key = e.key;
                    if (value.length === 0 ||
                        key === KeyCodes.ARROW_LEFT ||
                        key === KeyCodes.ARROW_RIGHT) {
                        handleKeyCodes(e);
                    }
                },
                onFocus: (e) => {
                    mainRef.current.currentActiveInputIndex =
                        mainRef.current.fields.findIndex((inputEl) => inputEl.element === e.target);
                    e.target.select();
                },
                ref: useCallback((fieldRef) => {
                    if (fieldRef) {
                        const indirectInputRef = fieldRef.querySelector("input,textarea");
                        if (indirectInputRef) {
                            fieldRef = indirectInputRef;
                        }
                        if (options.required) {
                            fieldRef.required = options.required;
                        }
                        fieldRef.maxLength = inputMaxLength;
                        mainRef.current.uniqueNames.push(name);
                        fieldRef.type = TYPE_MAP[type];
                        mainRef.current.fields.push({
                            element: fieldRef,
                            inputName: name,
                            maxLength: inputMaxLength
                        });
                    }
                }, []),
                style: defaultInlineStyles,
                placeholder
            };
        },
        setValue: (val) => {
            if (val) {
                let remainingValue = val.toString().slice(0, mainRef.current.totalInputValueLength);
                const finalValue = remainingValue;
                mainRef.current.fields.forEach((input, i) => {
                    const max = input.maxLength;
                    input.element.value = remainingValue.slice(0, max);
                    remainingValue = remainingValue.slice(max);
                });
                setValue(finalValue);
            }
        },
        setDisabled: (disabled) => {
            mainRef.current.fields.forEach((input) => {
                input.element.disabled = disabled;
            });
        },
        clear: () => {
            mainRef.current.currentActiveInputIndex = 0;
            mainRef.current.fields[mainRef.current.currentActiveInputIndex].element.focus();
            mainRef.current.fields.forEach((input) => {
                input.element.value = "";
            });
            setValue("");
        },
        value,
        get inputs() {
            let inputProps = [];
            if (typeof numberOfInputs === 'number' && numberOfInputs > 0) {
                for (let i = 0; i < numberOfInputs; i++) {
                    inputProps.push(this.register(`num-${i}`));
                }
                return inputProps;
            }
            else {
                return [];
            }
        },
        error,
        setError
    };
};
export default useOtpInput;
