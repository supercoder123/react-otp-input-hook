import React from "react";
import { InputFieldType, InputOptions, InputSyncOptions } from "../types";
declare const useOtpInput: ({ type, onInputValueChange, blankAllowed, focusOnLoad, autoCompleteAttribute, defaultInlineStyles, cycle, placeholder, numberOfInputs }?: InputSyncOptions) => {
    register: (name: string, options?: InputOptions) => {
        autoComplete: string;
        "aria-label": string;
        onKeyDown: (e: React.KeyboardEvent<InputFieldType>) => void;
        onInput: (e: React.FormEvent<InputFieldType>) => void;
        onKeyUp: (e: React.KeyboardEvent<InputFieldType>) => void;
        onFocus: (e: React.FocusEvent<InputFieldType>) => void;
        ref: (fieldRef: any) => void;
        style: React.CSSProperties | undefined;
        placeholder: string;
    };
    setValue: (val: string | number) => void;
    setDisabled: (disabled: boolean) => void;
    clear: () => void;
    value: string | number;
    readonly inputs: {
        autoComplete: string;
        "aria-label": string;
        onKeyDown: (e: React.KeyboardEvent<InputFieldType>) => void;
        onInput: (e: React.FormEvent<InputFieldType>) => void;
        onKeyUp: (e: React.KeyboardEvent<InputFieldType>) => void;
        onFocus: (e: React.FocusEvent<InputFieldType>) => void;
        ref: (fieldRef: any) => void;
        style: React.CSSProperties | undefined;
        placeholder: string;
    }[];
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
};
export default useOtpInput;
