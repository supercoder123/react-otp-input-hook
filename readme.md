<div align="center">
  <img width="300" src="https://raw.githubusercontent.com/supercoder123/react-otp-input-hook/main/images/lib-logo.svg" alt="React OTP Input Hook" /> 

  
  [![npm](https://img.shields.io/npm/v/react-otp-input-hook)](https://www.npmjs.com/package/react-otp-input-hook)
  [![npm](https://img.shields.io/npm/dm/react-otp-input-hook)](https://www.npmjs.com/package/react-otp-input-hook)
  [![NPM](https://img.shields.io/npm/l/react-otp-input-hook)](https://github.com/supercoder123/react-otp-input-hook/blob/main/LICENSE.md)
  [![Coverage Status](https://coveralls.io/repos/github/supercoder123/react-otp-input-hook/badge.svg?branch=main)](https://coveralls.io/github/supercoder123/react-otp-input-hook?branch=main)
  [![Build Status](https://app.travis-ci.com/supercoder123/react-otp-input-hook.svg?branch=main)](https://app.travis-ci.com/supercoder123/react-otp-input-hook)

</div> 

# React Otp Input Hook

A simple react hook to create otp inputs with ease. Inspired by libraries like react-hook-form, downshift-js ...etc



## Features
- No dependencies (only needs react as peer dependency)
- Small size
- Easy to use
- Does not come with any styling so you are free to use any input component of your own. (refs need to be forwarded)
- Written in typescript
- Lots of options
- Works with many libraries
  

<br>

#### Docs: https://supercoder123.github.io/react-otp-input-docs/  
<br>


## Installation
```
npm i react-otp-input-hook
```



## Usage

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

<center>
  <img width="100%" alt="Basic component output" src="https://raw.githubusercontent.com/supercoder123/react-otp-input-hook/main/images/basic-component.gif" />
</center>


