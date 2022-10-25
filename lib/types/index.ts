import { CSSProperties } from "react";

export interface InputOptions {
    required?: boolean;
    maxLength?: number;
    cyclable?: boolean;
    type?: 'number' | 'text' | 'alphanumeric'
}

export type InputFieldType = HTMLTextAreaElement & HTMLInputElement;

export interface InputSyncOptions {
    type?: "number" | "text" | "password";
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
    isDirty: boolean;
    inputName: string;
};

export type InputSyncState = {
    fields: Array<InputField>;
    uniqueNames: string[];
    currentActiveInputIndex: number;
    // currentActiveInputName: string;
    value: string | number;
    errors: {
        [key in string]: boolean;
    };
};

export enum KeyCodes {
    ARROW_RIGHT = "ArrowRight",
    ARROW_LEFT = "ArrowLeft",
    SPACEBAR = " ",
    BACKSPACE = "Backspace",
}