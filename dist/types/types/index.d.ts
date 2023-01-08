import { ClipboardEvent, CSSProperties } from "react";
export interface InputOptions {
    required?: boolean;
    maxLength?: number;
}
export type InputFieldType = HTMLTextAreaElement | HTMLInputElement;
export type DefaultInputSyncProps = {};
export interface InputSyncProps {
    type?: "numeric" | "alphanumeric" | "password" | "password-numeric";
    onInputValueChange?: (val: string) => void;
    blankAllowed?: boolean;
    focusOnLoad?: boolean;
    defaultInlineStyles?: CSSProperties;
    defaultClassName?: string;
    autoCompleteAttribute?: string | undefined;
    cycle?: boolean;
    placeholder?: string;
    numberOfInputs?: number;
}
export type InputSyncOptions = DefaultInputSyncProps & InputSyncProps;
export type InputField = {
    element: InputFieldType;
    inputName: string;
    maxLength?: number;
};
export type InputSyncState = {
    fields: Array<InputField>;
    uniqueNames: string[];
    currentActiveInputIndex: number;
    value: string | number;
    totalInputValueLength: number;
};
export declare enum KeyCodes {
    ARROW_RIGHT = "ArrowRight",
    ARROW_LEFT = "ArrowLeft",
    SPACEBAR = " ",
    BACKSPACE = "Backspace",
    ENTER = "Enter"
}
export type InputTypeMap = {
    'numeric': 'tel';
    'alphanumeric': 'text';
    'password': 'password';
    'password-numeric': 'password';
};
export type RegisterReturn<T> = {
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
