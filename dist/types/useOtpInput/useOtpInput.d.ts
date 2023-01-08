import React, { ClipboardEvent } from "react";
import { InputFieldType, InputOptions, InputSyncOptions } from "../types";
type RegisterReturn<T> = {
    autoComplete: string;
    "aria-label": string;
    name: string;
    onKeyDown: (e: React.KeyboardEvent<T>) => void;
    onInput: (e: React.FormEvent<T>) => void;
    onKeyUp: (e: React.KeyboardEvent<T>) => void;
    onFocus: (e: React.FocusEvent<T>) => void;
    ref: (fieldRef: T) => void;
    style: React.CSSProperties | undefined;
    placeholder: string;
    onPaste: (e: ClipboardEvent<T>) => void;
};
declare const useOtpInput: <T extends InputFieldType = HTMLInputElement>({ type, onInputValueChange, blankAllowed, focusOnLoad, autoCompleteAttribute, defaultInlineStyles, cycle, placeholder, numberOfInputs }?: InputSyncOptions) => {
    register(name: string, options?: InputOptions): {
        autoComplete: string;
        "aria-label": string;
        name: string;
        onKeyDown: (e: React.KeyboardEvent<T>) => void;
        onInput: (e: React.FormEvent<T>) => void;
        onKeyUp: (e: React.KeyboardEvent<T>) => void;
        onFocus: (e: React.FocusEvent<T, Element>) => void;
        ref: (fieldRef: T) => void;
        style: React.CSSProperties | undefined;
        placeholder: string;
        onPaste: (e: React.ClipboardEvent<T>) => void;
    };
    setValue: (val: string | number) => void;
    setDisabled: (disabled: boolean) => void;
    clear: () => void;
    value: string | number;
    readonly inputs: RegisterReturn<T>[];
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
};
export default useOtpInput;
