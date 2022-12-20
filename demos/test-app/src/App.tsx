import { memo } from "react";
import React from "react";
import { useEffect, useState, useMemo } from "react";

import reactLogo from "./assets/react.svg";
import "./App.css";
import { useOtpInput } from "../../../lib";

const LoopInput = memo(({ inputs }) => {
  return inputs.map((inputProps, i) => {
    return <input key={i} required {...inputProps} />;
  });
});

export function OTPInputBasic() {
  const {
    register,
    clear,
    setDisabled,
    setValue,
    value,
    error,
    setError,
    inputs,
  } = useOtpInput<HTMLInputElement>({
    type: 'numeric',
    focusOnLoad: true,
    // blankAllowed: true,
    // placeholder: '*',
    // cycle: true,
    // // defaultInlineStyles: {
    // //   border: '2px solid green',
    // //   borderRadius: '5px'
    // // },
    // onInputValueChange(val) {
    //   console.log(val)
    // },
    numberOfInputs: 5,
  });

  // const { inputs, clear: cc, value: sv, } = useOtpInput({
  //   type: 'numeric',
  //   focusOnLoad: true,
  //   placeholder: '-',
  //   numberOfInputs: 5,
  // });
  const memInputs = useMemo(() => inputs, []);
  const registerOptions = {
    required: true,
  };

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="container">
          <input {...register("digit-1", registerOptions)} />
          -
          <input {...register("digit-2", registerOptions)} />
          -
          <input {...register("digit-3", registerOptions)} />
          -
          <input {...register("digit-4", registerOptions)} />
          -
          <input {...register("digit-5", registerOptions)} />
        </div>

        <div className="container">
          {memInputs.map((inputProps, i) => {
            return (
              <input
                className={error ? "error" : ""}
                key={i}
                required
                {...inputProps}
              />
            );
          })}
          {/* <LoopInput inputs={memInputs}/> */}
        </div>

        <div className="value">Value: {value}</div>
        {/* <div className="value">Value: {sv}</div> */}
        <div className="value">Error: {error}</div>

        <button
          type="button"
          onClick={() => {
            clear();
          }}
        >
          Clear
        </button>
        <button
          type="submit"
          onClick={() => {
            // console.log('es', sv, sv.toString().length);
            // if (sv.toString().length >= 3) {
            //   setValue(sv.toString())
            // }
          }}
        >
          Submit
        </button>
        <button
          type="button"
          onClick={() => {
            setError("Invalid");
          }}
        >
          SetError
        </button>
        <button
          type="button"
          onClick={() => {
            setError("");
          }}
        >
          Clear Error
        </button>
        <button
          type="button"
          onClick={() => {
            setValue("asdbd");
          }}
        >
          Set Value
        </button>
      </form>
    </>
  );
}

const Component = React.memo(({ onChange }: any) => {

  const { inputs } = useOtpInput({
    numberOfInputs: 5,
    onInputValueChange: onChange,
    focusOnLoad: true,
    placeholder: "*",
    blankAllowed: true
  });

  return (
    <>
      {inputs.map((input, i) => {
        return <input required key={i} {...input} />;
      })}
    </>
  );
});

function App() {
  const [val, setVal] = useState('');

  return (
    <div>
      <OTPInputBasic />

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
      <Component 
        onChange={(val: any) => {
          console.log(val)
          setVal(val)
        }}
      />

        {val}

      <button
          type="submit"
          onClick={() => {
            console.log(val);
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default App;
