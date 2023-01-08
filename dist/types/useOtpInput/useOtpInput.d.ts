import React from "react";
import { InputFieldType, InputOptions, InputSyncOptions, RegisterReturn } from "../types";
declare const useOtpInput: <T extends InputFieldType = HTMLInputElement>({ type, onInputValueChange, blankAllowed, focusOnLoad, autoCompleteAttribute, defaultInlineStyles, cycle, placeholder, numberOfInputs }?: InputSyncOptions) => {
    register(name: string, options?: InputOptions): RegisterReturn<T>;
    setValue: (val: string | number) => void;
    setDisabled: (disabled: boolean) => void;
    clear: () => void;
    value: string | number;
    readonly inputs: RegisterReturn<T>[];
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
};
export default useOtpInput;
