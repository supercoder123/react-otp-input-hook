import React, { useEffect, useRef, useState } from "react";

import {
    InputField,
    InputFieldType,
    InputOptions,
    InputSyncOptions,
    InputSyncState,
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
        KeyCodes.BACKSPACE,
    ].includes(value);
};

const useInputSync = ({
    type,
    onInputValueChange,
    blankAllowed = false,
    focusOnLoad = false,
    autoCompleteAttribute = "off",
    defaultInlineStyles,
    defaultClassName,
    cycle = false,
    perInputPattern
}: InputSyncOptions) => {
    const mainRef = useRef<InputSyncState>({
        fields: [],
        uniqueNames: [],
        currentActiveInputIndex: 0,
        // currentActiveInputName: '',
        value: type === "number" ? 0 : "",
        errors: {},
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
            let inputMaxLength = options.maxLength ? options.maxLength : 1;
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
                    console.log(key)
                    /**
                     * any input blocking has to happen on key down since it happens before the key is displayed on the screen input
                     * cannot read any input values from onKeyDown event as is always updates on the next event, same with keyup event
                    */
                    if (!blankAllowed && key === KeyCodes.SPACEBAR) {
                        e.preventDefault();
                    }
                    if (
                        (value.length >= inputMaxLength &&
                        key !== KeyCodes.BACKSPACE &&
                        !isInputTextSelected(e.target as InputFieldType))
                    ) {
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

                    if (!perInputPattern!(value)) {
                        e.preventDefault();
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
                onBlur: (e: React.FocusEvent<InputFieldType>) => {

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
                        mainRef.current.fields.push({
                            element: fieldRef,
                            isDirty: false,
                            inputName: name,
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
        setValue: (val: string | number) => {
            if (val) {
                const valArr = val.toString().split("");
                mainRef.current.fields.forEach((input, i) => {
                    input.element.value = valArr[i];
                });
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
        errors: mainRef.current.errors,
        setErrors: (name: string) => {
            if (mainRef.current.errors[name]) {
                mainRef.current.errors[name] = true;
            }
            // setErrorsState(true)
        },
        inputState: mainRef.current,
        value,
    };
};

export default useInputSync;

/**
 
const otp = () => {
    const {register, onChange, setValue, setDisabled, clear} = useInputSync({
        type: number | password | text,
    });
    return (
        <>
            <input {...register('one', { maxLength: 3, required: true })} />
            <input {...register('two', { maxLength: 1, required: true })})} />
            <input {...register('three')} />
            <input {...register('four')} />
        </>
    )
}

1. basic implementation [X]
2. keyboard handling [X]
3. basic on change handler and value [X]
4. aria accessibility
5. input ordering
6. multiple max length [x]
7. error handling
8. placeholder support
9. regex pattern support
10. cyclable
11. setValue
12. ctrl a

  
{
    isDirty: false,
    element: field,
    inputName: '',
}
  
 */
