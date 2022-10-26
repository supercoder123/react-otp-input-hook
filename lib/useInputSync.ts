import React, { useEffect, useRef, useState } from "react";

import {
    InputField,
    InputFieldType,
    InputOptions,
    InputSyncOptions,
    InputSyncState,
    InputTypeMap,
    KeyCodes,
} from "./types";

const defaultRegisterOptions = {
    maxLength: 1,
    required: false,
};

const focusInputField = (
    fields: Array<InputField>,
    currentActiveIndex: number
) => {
    if (isValidFieldIndex(fields, currentActiveIndex)) {
        fields[currentActiveIndex].element.focus();
        return fields[currentActiveIndex];
    }
};

const isValidFieldIndex = (
    fields: Array<InputField>,
    currentActiveIndex: number
) => {
    return currentActiveIndex < fields.length && currentActiveIndex >= 0;
};

const isValidInput = (value: string) => {
    return ![
        "",
        KeyCodes.ARROW_LEFT,
        KeyCodes.ARROW_RIGHT,
        KeyCodes.BACKSPACE,
        KeyCodes.ENTER,
        KeyCodes.SPACEBAR
    ].includes(value);
};

/** non number or char keys */
const SPECIAL_KEYS: string[] = [KeyCodes.ARROW_LEFT, KeyCodes.ARROW_RIGHT, KeyCodes.BACKSPACE, KeyCodes.SPACEBAR, KeyCodes.ENTER];

const TYPE_MAP: InputTypeMap = {
    'numeric': 'tel',
    'alphanumeric': 'text',
    'password': 'password',
    'password-numeric': 'password'
}

const useInputSync = ({
    type = 'alphanumeric',
    onInputValueChange,
    blankAllowed = false,
    focusOnLoad = false,
    autoCompleteAttribute = "off",
    defaultInlineStyles,
    cycle = false,
}: InputSyncOptions) => {
    const mainRef = useRef<InputSyncState>({
        fields: [],
        uniqueNames: [],
        currentActiveInputIndex: 0,
        // currentActiveInputName: '',
        value: type === "numeric" ? 0 : "",
        totalInputValueLength: 0
    });

    const [value, setValue] = useState<number | string>("");

    const handleKeyCodes = (e: React.KeyboardEvent<InputFieldType>) => {
        const key = e.key;
        if (key === KeyCodes.ARROW_LEFT) {
            focusInputField(mainRef.current.fields, getPrevIndex());
        } else if (key === KeyCodes.ARROW_RIGHT) {
            focusInputField(mainRef.current.fields, getNextIndex());
        } else if (key === KeyCodes.BACKSPACE) {
            focusInputField(mainRef.current.fields, getPrevIndex());
        } else if (key === KeyCodes.SPACEBAR) {
            e.preventDefault();
        }
    };

    const getNextIndex = () => {
        const idx = mainRef.current.currentActiveInputIndex;
        mainRef.current.currentActiveInputIndex = isValidFieldIndex(
            mainRef.current.fields,
            idx + 1
        )
            ? idx + 1
            : cycle ? 0 : idx;    
        return mainRef.current.currentActiveInputIndex;
    };

    const getPrevIndex = () => {
        const idx = mainRef.current.currentActiveInputIndex;
        mainRef.current.currentActiveInputIndex = isValidFieldIndex(
            mainRef.current.fields,
            idx - 1
        )
            ? idx - 1
            : cycle ? mainRef.current.fields.length - 1 : idx;

        return mainRef.current.currentActiveInputIndex;
    };

    useEffect(() => {
        if (focusOnLoad) {
            try {
                mainRef.current.fields[0].element.focus();
            } catch (e) {
                console.error("Cannot find field on load");
            }
        }
        mainRef.current.totalInputValueLength = mainRef.current.fields.reduce((acc, input) => {
            acc += input.maxLength!;
            return acc;
        }, 0);
    }, []);

    const isInputTextSelected = (input: InputFieldType) => {
        if (typeof input.selectionStart == "number") {
            return (
                input.selectionStart == 0 && input.selectionEnd == input.value.length
            );
        }
        return false;
    };

    return {
        register: (
            name: string,
            options: InputOptions = defaultRegisterOptions
        ) => {
            const inputMaxLength = options.maxLength ? options.maxLength : 1;

            return {
                autoComplete: autoCompleteAttribute,
                "aria-label": `otp-input-${name}`,
                /** 
                 * Sequence is onKeyDown, onInput, onKeyUp, that's just how keyboard events work
                 * Need to use a combination of all 3 since keyCode values are not part of the oninput event
                */
                onKeyDown: (e: React.KeyboardEvent<InputFieldType>) => {
                    const value = (e.target as InputFieldType).value;
                    const key = e.key;
                    /**
                     * any input blocking has to happen on key down since it happens before the key is displayed on the screen input
                     * cannot read any input values from onKeyDown event as is always updates on the next event, same with keyup event
                    */
                    if (!blankAllowed && key === KeyCodes.SPACEBAR) {
                        e.preventDefault();
                    }
                    if (
                        (value.length >= inputMaxLength &&
                        key !== KeyCodes.BACKSPACE && key !== KeyCodes.ENTER &&
                        !isInputTextSelected(e.target as InputFieldType))
                    ) {
                        e.preventDefault();
                    }
                    if ((type === 'numeric' || type === 'password-numeric') && /^[\d]$/.test(key) && !SPECIAL_KEYS.includes(key)) {
                        e.preventDefault();
                    }
                },
                /**
                 * onInput event gives the most accurate value of the input
                 */
                onInput: (e: React.FormEvent<InputFieldType>) => {
                    const value = (e.target as InputFieldType).value;

                    /** This is not called while pressing backspace */
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
                /**
                 * Cannot perform any input blocking here as it is too late
                 */
                onKeyUp: (e: React.KeyboardEvent<InputFieldType>) => {
                    e.preventDefault();
                    const value = (e.target as InputFieldType).value;
                    const key = e.key;

                    if (
                        value.length === 0 ||
                        key === KeyCodes.ARROW_LEFT ||
                        key === KeyCodes.ARROW_RIGHT
                    ) {
                        handleKeyCodes(e);
                    }
                },
                onFocus: (e: React.FocusEvent<InputFieldType>) => {
                    mainRef.current.currentActiveInputIndex =
                        mainRef.current.fields.findIndex(
                            (inputEl) => inputEl.element === e.target
                        );
                    (e.target as InputFieldType).select();
                },
                ref: (fieldRef: any) => {
                    if (fieldRef) {
                        const indirectInputRef = fieldRef.querySelector("input,textarea");
                        if (indirectInputRef) {
                            fieldRef = indirectInputRef;
                        }
                        fieldRef.required = !!options.required;
                        mainRef.current.uniqueNames.push(name);
                        fieldRef.type = TYPE_MAP[type];
                        mainRef.current.fields.push({
                            element: fieldRef,
                            // isDirty: false,
                            inputName: name,
                            maxLength: inputMaxLength
                        });
                    } else {
                        mainRef.current.fields = [];
                        mainRef.current.uniqueNames = [];
                    }
                },
                style: defaultInlineStyles,
                // className: defaultClassName
            };
        },
        setValue: (val: string) => {
            if (val) {
                let remainingValue = val.slice(0, mainRef.current.totalInputValueLength);
                const finalValue = remainingValue;
                mainRef.current.fields.forEach((input, i) => {
                    const max = input.maxLength;
                    input.element.value = remainingValue.slice(0, max);
                    remainingValue = remainingValue.slice(max);
                });
                setValue(finalValue);
            }
        },
        setDisabled: (disabled: boolean) => {
            mainRef.current.fields.forEach((input) => {
                input.element.disabled = disabled;
            });
        },
        clear: () => {
            mainRef.current.currentActiveInputIndex = 0;
            mainRef.current.fields[
                mainRef.current.currentActiveInputIndex
            ].element.focus();
            mainRef.current.fields.forEach((input) => {
                input.element.value = "";
            });
            setValue("");
        },
        inputState: mainRef.current,
        value,
    };
};

export default useInputSync;
