import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useForm, Controller } from "react-hook-form";
import useInputSync from "../lib/useInputSync";
import TextField from '@mui/material/TextField';
export default function Form() {
    const { register, handleSubmit, watch, formState: { errors }, control } = useForm({
        defaultValues: {
            example: '',
            exampleTwo: '',
            exampleThree: ''
        }
    });
    console.log('Form');
    const { register: registerInput, clear, setDisabled, setValue, inputState, value } = useInputSync({
        onInputValueChange: (v) => {
            console.log('va', v);
        },
        blankAllowed: true,
        focusOnLoad: true,
        defaultInlineStyles: {
            width: '40px',
            height: '40px',
            fontSize: '20px',
            textAlign: 'center'
        }
    });
    const onSubmit = (data) => console.log('data', data, value);
    //   console.log(watch("example")); // watch input value by passing the name of it
    // console.log(registerInput('adf'), register('adf'))
    return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    _jsxs("form", { onSubmit: handleSubmit(onSubmit), children: [_jsx(Controller, { name: "example", control: control, render: ({ field }) => _jsx(TextField, { label: "adsfsd", ...field, ...registerInput('register-one') }) }), _jsx(Controller, { name: "exampleTwo", control: control, render: ({ field }) => _jsx(TextField, { ...field, ...registerInput('register-two') }) }), _jsx(Controller, { name: "exampleThree", control: control, rules: { required: true }, render: ({ field }) => _jsx(TextField, { ...field, ...registerInput('register-three') }) }), errors.exampleThree && _jsx("span", { children: "This field is required" }), _jsx("input", { type: "submit" })] }));
}
