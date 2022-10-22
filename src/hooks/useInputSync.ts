import React, {
    FormEvent,
    RefCallback,
    RefObject,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

interface InputOptions {
    required?: boolean;
    maxLength?: number;
    cyclable?: boolean;
}

type InputFieldType = HTMLTextAreaElement & HTMLInputElement;

interface InputSyncOptions {
    type?: "number" | "text" | "password";
    separator?: string;
    onInputValueChange?: (val: string | number) => void;
    blankAllowed?: boolean;
    focusOnLoad?: boolean;
}

type InputField = {
    element: InputFieldType,
    isDirty: boolean;
    inputName: string;
}

type InputSyncState = {
    fields: Array<InputField>;
    uniqueNames: string[];
    currentActiveInputIndex: number;
    // currentActiveInputName: string;
    value: string | number;
    errors : {
        [key in string]: boolean;
    }
}

const defaultRegisterOptions = {
    maxLength: 1,
    required: false,
};

enum KeyCodes {
    ARROW_RIGHT = "ArrowRight",
    ARROW_LEFT = "ArrowLeft",
    SPACEBAR = " ",
    BACKSPACE = "Backspace",
}

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



const useInputSync = ({ type, onInputValueChange, blankAllowed = false, focusOnLoad = false }: InputSyncOptions) => {
    const mainRef = useRef<InputSyncState>({
        fields: [],
        uniqueNames: [],
        currentActiveInputIndex: 0,
        // currentActiveInputName: '',
        value: type === 'number' ? 0 : '',
        errors: {}
    });

    const [value, setValue] = useState<number | string>('');

    const handleKeyCodes = (e: React.KeyboardEvent<InputFieldType>) => {
        const key = e.key;
        if (key === KeyCodes.ARROW_LEFT) {
            focusInputField(mainRef.current.fields, getPrevIndex());
        } else if (key === KeyCodes.ARROW_RIGHT) {
            focusInputField(mainRef.current.fields, getNextIndex());
        } else if (key === KeyCodes.BACKSPACE) {
            // e.preventDefault();
            focusInputField(mainRef.current.fields, getPrevIndex());
        } else if (key === KeyCodes.SPACEBAR) {
            e.preventDefault();
            // focusInputField(mainRef.current.fields, getNextIndex());
        } else {
            // e.preventDefault();
        }
    };

    const getNextIndex = () => {
        const idx = mainRef.current.currentActiveInputIndex;
        mainRef.current.currentActiveInputIndex = isValidFieldIndex(
            mainRef.current.fields,
            idx + 1
        )
            ? idx + 1
            : idx;
        return mainRef.current.currentActiveInputIndex;
    };

    const getPrevIndex = () => {
        const idx = mainRef.current.currentActiveInputIndex;
        mainRef.current.currentActiveInputIndex = isValidFieldIndex(
            mainRef.current.fields,
            idx - 1
        )
            ? idx - 1
            : idx;
        return mainRef.current.currentActiveInputIndex;
    };

    useEffect(() => {
        if (focusOnLoad) {
            mainRef.current.fields[0].element.focus();
        }
    }, []);

    const isInputTextSelected = (input: InputFieldType) => {
        if (typeof input.selectionStart == "number") {
            return input.selectionStart == 0 && input.selectionEnd == input.value.length;
        }
        return false;
    }

    return {
        register: (
            name: string,
            options: InputOptions = defaultRegisterOptions
        ) => {
            let inputMaxLength = options.maxLength ? options.maxLength : 1;
            return {
                autoComplete: "off",
                'aria-label': `otp-input-${name}`,
                onKeyDown: (e: React.KeyboardEvent<InputFieldType>) => {
                    const value = (e.target as InputFieldType).value;
                    const key = e.key;
                    if (!blankAllowed && key === KeyCodes.SPACEBAR) {
                        e.preventDefault();
                    }
                    if (value.length >= inputMaxLength && key !== KeyCodes.BACKSPACE && !isInputTextSelected(e.target as InputFieldType)) {
                        e.preventDefault();
                    }
                },
                onKeyUp: (e: React.KeyboardEvent<InputFieldType>) => {
                    e.preventDefault();
                    const value = (e.target as InputFieldType).value;
                    const key = e.key;

                    if (value.length === 0 || key === KeyCodes.ARROW_LEFT || key === KeyCodes.ARROW_RIGHT) {
                        handleKeyCodes(e)
                    }
                },
                onInput: (e: React.FormEvent<InputFieldType>) => {

                    const value = (e.target as InputFieldType).value;

                    if (value.length >= inputMaxLength && value !== '') {
                        focusInputField(mainRef.current.fields, getNextIndex());
                    }
                    mainRef.current.value = mainRef.current.fields.map((input) => input.element.value).join('');
                    if (onInputValueChange) {
                        onInputValueChange(mainRef.current.value);
                    }
                    setValue(mainRef.current.value);
                },
                onBlur: (e: React.FocusEvent<InputFieldType>) => {

                },
                onFocus: (e: React.FocusEvent<InputFieldType>) => {
                    mainRef.current.currentActiveInputIndex = mainRef.current.fields.findIndex(inputEl => inputEl.element === e.target);
                    (e.target as InputFieldType).select();
                },
                ref: (fieldRef: InputFieldType) => {
                    if (fieldRef) {
                        fieldRef.required = options.required ? options.required : false;
                        mainRef.current.uniqueNames.push(name);
                        mainRef.current.fields.push({
                            element: fieldRef,
                            isDirty: false,
                            inputName: name
                        });
                    } else {
                        mainRef.current.fields = [];
                        mainRef.current.uniqueNames = [];
                    }

                },
            };
        },
        setValue: (val: string | number) => {
            if (val) {
                const valArr = val.toString().split('');
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
            mainRef.current.fields.forEach((input) => {
                input.element.value = "";
            });
        },
        errors: mainRef.current.errors,
        setErrors: (name: string) => {
            if (mainRef.current.errors[name]) {
                mainRef.current.errors[name] = true;
            }
            // setErrorsState(true)
        },
        inputState: mainRef.current,
        value
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
