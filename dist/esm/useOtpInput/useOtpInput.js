import { useRef, useState, useCallback, useLayoutEffect } from "react";
import { KeyCodes, } from "../types";
const defaultRegisterOptions = {
    maxLength: 1,
    required: false,
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
    const [value, setValueState] = useState("");
    const [error, setError] = useState("");
    const focusInputField = (currentActiveIndex) => {
        const fields = mainRef.current.fields;
        if (isValidFieldIndex(currentActiveIndex)) {
            fields[currentActiveIndex].element.focus();
            return fields[currentActiveIndex];
        }
    };
    const isValidFieldIndex = (currentActiveIndex) => {
        const fields = mainRef.current.fields;
        return currentActiveIndex < fields.length && currentActiveIndex >= 0;
    };
    const handleKeyCodes = (e) => {
        const key = e.key;
        if (key === KeyCodes.ARROW_LEFT) {
            focusInputField(getPrevIndex());
        }
        else if (key === KeyCodes.ARROW_RIGHT) {
            focusInputField(getNextIndex());
        }
        else if (key === KeyCodes.BACKSPACE) {
            focusInputField(getPrevIndex());
        }
        else if (key === KeyCodes.SPACEBAR) {
            e.preventDefault();
        }
    };
    const getNextIndex = () => {
        const idx = mainRef.current.currentActiveInputIndex;
        mainRef.current.currentActiveInputIndex = isValidFieldIndex(idx + 1) ? idx + 1 : cycle ? 0 : idx;
        return mainRef.current.currentActiveInputIndex;
    };
    const getPrevIndex = () => {
        const idx = mainRef.current.currentActiveInputIndex;
        mainRef.current.currentActiveInputIndex = isValidFieldIndex(idx - 1) ? idx - 1 : cycle ? mainRef.current.fields.length - 1 : idx;
        return mainRef.current.currentActiveInputIndex;
    };
    useLayoutEffect(() => {
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
    const fillInputValue = (startIndex = 0, val) => {
        if (val) {
            const numberOfInputs = mainRef.current.fields.length;
            let remainingValue = val.toString().slice(0, numberOfInputs);
            const inputTextLength = remainingValue.length;
            const finalValue = remainingValue;
            for (let i = startIndex; i < Math.min(numberOfInputs, inputTextLength); i++) {
                const inputFields = mainRef.current.fields;
                const max = inputFields[i].maxLength;
                inputFields[i].element.value = remainingValue.slice(0, max);
                remainingValue = remainingValue.slice(max);
            }
            setValueState(finalValue);
            mainRef.current.value = finalValue;
        }
    };
    return {
        register(name, options = defaultRegisterOptions) {
            const inputMaxLength = options.maxLength ? options.maxLength : 1;
            return {
                autoComplete: autoCompleteAttribute,
                "aria-label": `otp-input-${name}`,
                name: `otp-input-${name}`,
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
                        focusInputField(getNextIndex());
                    }
                    mainRef.current.value = mainRef.current.fields
                        .map((input) => input.element.value)
                        .join("");
                    if (onInputValueChange) {
                        onInputValueChange(mainRef.current.value);
                    }
                    setValueState(mainRef.current.value);
                },
                onKeyUp: (e) => {
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
                    e.target.setSelectionRange(0, inputMaxLength);
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
                placeholder,
                onPaste: (e) => {
                    const paste = e.clipboardData.getData("text");
                    fillInputValue(mainRef.current.currentActiveInputIndex, paste);
                    const numberOfInputs = mainRef.current.fields.length;
                }
            };
        },
        setValue: (val) => {
            fillInputValue(0, val);
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
            setValueState("");
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
                console.warn('Please provide `numOfInputs` to use the input array map');
                return [];
            }
        },
        error,
        setError
    };
};
export default useOtpInput;
