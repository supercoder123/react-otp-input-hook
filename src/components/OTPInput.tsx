import React, { useEffect, useState } from "react";
import useInputSync from "../hooks/useInputSync";
import './style.css';

const OTPInput = ({onChangeHandler, maxLength}:  any) => {
  const { register, clear, setDisabled, setValue, inputState, value } = useInputSync({
      onInputValueChange: onChangeHandler,
      blankAllowed: false,
      focusOnLoad: true
  });

  const [error, seterror] = useState(true);

  useEffect(() => {
    // seterror(true);
    console.log('state', inputState)
  }, [inputState])

//   useEffect(() => {
//     setDisabled(true)
//   }, [value]);
    const inputs: JSX.Element[] = [];
    for(let i=0; i<maxLength; i++) {
        const classNm = `otp-input ${error ? 'error' : ""}`
        inputs.push(<input key={i} className={classNm} {...register(`name-${i}`)} />);
    }

  return (
    <>
      <div style={{ display: "flex", alignItems: 'center', justifyContent:'space-between', maxWidth: '500px'  }}>
        <input className="otp-input" placeholder="-" {...register("one")} />
        * 
        <input className="otp-input" placeholder="-" {...register("two")} />
        *
        <input className="otp-input" placeholder="-" {...register("c")} />
        *
        <input className="otp-input" placeholder="-" {...register("d")} />
        *
        <input className="otp-input" placeholder="-" {...register("d")} />
        {/* {inputs} */}
        {/* <input placeholder="fd" className="otp-input" {...register("two", {maxLength: 3})} /> */}
      </div>
        {value}
    </>
  );
};

export default OTPInput;
