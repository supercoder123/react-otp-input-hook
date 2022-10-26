import { CSSProperties } from "react";

export interface InputOptions {
    required?: boolean;
    maxLength?: number;
}

export type InputFieldType = HTMLTextAreaElement & HTMLInputElement;

export interface InputSyncOptions {
    type?: "numeric" | "alphanumeric" | "password" | "password-numeric";
    onInputValueChange?: (val: string | number) => void;
    blankAllowed?: boolean;
    focusOnLoad?: boolean;
    defaultInlineStyles?: CSSProperties;
    defaultClassName?: string;
    autoCompleteAttribute?: string | undefined;
    cycle?: boolean;
    perInputPattern?: (val: string) => boolean;
}

export type InputField = {
    element: InputFieldType;
    // isDirty: boolean;
    inputName: string;
    maxLength?: number;
};

export type InputSyncState = {
    fields: Array<InputField>;
    uniqueNames: string[];
    currentActiveInputIndex: number;
    // currentActiveInputName: string;
    value: string | number;
    // errors: {
    //     [key in string]: boolean;
    // };
    totalInputValueLength: number;
};

export enum KeyCodes {
    ARROW_RIGHT = "ArrowRight",
    ARROW_LEFT = "ArrowLeft",
    SPACEBAR = " ",
    BACKSPACE = "Backspace",
    ENTER = "Enter",
}

export type InputTypeMap = {
    'numeric': 'tel',
    'alphanumeric': 'text',
    'password': 'password',
    'password-numeric': 'password'
}