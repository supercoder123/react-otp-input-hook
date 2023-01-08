<div align="center">
<img width="300" src="https://raw.githubusercontent.com/supercoder123/react-otp-input-hook/main/images/lib-logo.svg" alt="React OTP Input Hook" /> 
</div> 

A simple react hook to create otp inputs with ease. Inspired by libraries like react-hook-form, 

## Features
- No dependencies (only needs react as peer dependency)
- Small size
- Easy to use
- Does not come with any styling so you are free to use any input component of your own. (refs need to be forwarded)
- Written in typescript
- Lots of options
- Works with many libraries

## Installation
```
npm i react-otp-input-hook
```

## Basic Usage

```
import { useOtpInput } from "react-otp-input-hook";

const BasicOTPComponent = ({ onChange }: { onChange: (val: string) => void }) => {
  const { register } = useOtpInput({
    onInputValueChange: onChange,
  });

  const defaultOptions = { required: true };

  return (
    <div style={{ padding: '10px' }}>
      <input {...register("digit-1", defaultOptions)} />
      <input {...register("digit-2", defaultOptions)} />
      <input {...register("digit-3", defaultOptions)} />
      <input {...register("digit-4", defaultOptions)} />
      <input {...register("digit-5", defaultOptions)} />
    </div>
  );
};
```

OR

```
import { useOtpInput } from "react-otp-input-hook";

const BasicOTPComponent = ({ onChange }: { onChange: (val: string) => void }) => {
  const { inputs } = useOtpInput({
    numberOfInputs: 5,
    onInputValueChange: onChange,
  });

  return (
    <div>
      {inputs.map((input, i) => {
        return <input required key={i} {...input} />;
      })}
    </div>
  );
};
```

## Use Inside any form
```
function App() {
  const [value, setValue] = useState("");

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log('Value', value);
        }}
      >

        <BasicOTPComponent
          onChange={(value: any) => {
            console.log(value);
            setValue(value);
          }}
        />

        <button
          type="submit"
        >
          Submit
        </button>
      </form>

      <div>{value}</div>
    </div>
  );
}
```

```
// styles 

form {
  display: flex;
  flex-direction: column;
}
form input {
  height: 40px;
  font-size: 20px;
  padding: 10px;
  margin-right: 10px;
  margin-left: 10px;
  width: 40px;
  text-align: center;
  font-family: sans-serif;
}
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
```

## Options
```
// T can be HTMLTextAreaElement or HTMLInputElement;

const { register, setValue, setDisabled, clear, value, inputs, error, setError } = useOtpInput<T>({
  type?: "numeric" | "alphanumeric" | "password" | "password-numeric";
  onInputValueChange?: (val: string) => void; // change listener to listen to the latest value
  blankAllowed?: boolean; // spacebar will be allowed
  focusOnLoad?: boolean; // focuses the first input on load
  defaultInlineStyles?: CSSProperties; // any css style object
  defaultClassName?: string;
  autoCompleteAttribute?: string | undefined;
  cycle?: boolean; // will cycle back to first input if key is pressed on the last input
  placeholder?: string;
  numberOfInputs?: number; // need to provide this option in order to use the inputs return value 
});

interface InputOptions {
  required?: boolean;
  maxLength?: number;
}

// Returned values
  
  // used to register an input, can be provided maxLength and required as props
  register: (name: string, options?: InputOptions) => RegisterReturn<T>; 
  
  // used to set the value for all inputs
  setValue: (val: string | number) => void;
  
  // disables all the inputs
  setDisabled: (disabled: boolean) => void; 
  
  // clears all inputs
  clear: () => void;

  // provides the value of the otp input
  value: string | number; 

  // Returns the inputs based on the value provided in numberOfInputs. Can be used to set the inputs in a loop instead of registering it one by one
  readonly inputs: RegisterReturn<T>[]; 

  // get an error string
  error: string;

  // set an error string
  setError: React.Dispatch<React.SetStateAction<string>>; 

```

## Output

<center>
  <img width="100%" alt="Basic component output" src="https://raw.githubusercontent.com/supercoder123/react-otp-input-hook/main/images/basic-component.gif" />
</center>
