import React, { useEffect, useState } from "react";
import useInputSync from "../../lib/useInputSync";
import TextField from '@mui/material/TextField';
import './style.css';
import { useForm } from "react-hook-form";
import { Input } from '@chakra-ui/react'

const OTPInput = ({ onChangeHandler, maxLength }: any) => {
  const { register, clear, setDisabled, setValue, inputState, value } = useInputSync({
    type: 'number',
    onInputValueChange: onChangeHandler,
    blankAllowed: true,
    focusOnLoad: true,
    cycle: true,
    perInputPattern: (val: string) => {
      return /^[\d]$/.test(val);
    },
    // defaultInlineStyles: {
    //   width: '40px',
    //   height: '40px',
    //   fontSize: '20px',
    //   textAlign: 'center',
    //   border: 'none',
    //   borderBottom: '1px solid black'
    // }
  });

  const [error, seterror] = useState(false);

  useEffect(() => {
    // seterror(true);
    console.log('state', inputState)
  }, [inputState])

  // useEffect(() => {
  //   setDisabled(true)
  // }, [value]);

  const inputs: JSX.Element[] = [];
  // for (let i = 0; i < maxLength; i++) {
  //   const classNm = `otp-input ${error ? 'error' : ""}`
  //   inputs.push(<input key={i} className={classNm} {...register(`name-${i}`)} />);
  // }

  return (
    <>
      <div style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between', maxWidth: '500px' }}>
        <input placeholder="-" {...register("one", { required: true })} />
        *
        <input placeholder="-" {...register("two")} />
        *
        <input placeholder="-" {...register("c")} />
        *
        <input placeholder="-" {...register("d")} />
        *
        <input placeholder="-" {...register("d")} />
        {inputs}
        {/* <input placeholder="fd" className="otp-input" {...register("two", {maxLength: 3})} /> */}
      </div>
      <div style={{height: "20px"}}>{value}</div>
      <button onClick={() => { clear() }}>Clear</button>

      {/* <TextField id="outlined-basic" label="Digit" variant="outlined" {...register("mui-input")} />
      <TextField id="outlined-basic" label="Digit" variant="outlined" {...register("mui-input-1")} />
      <TextField id="outlined-basic" label="Digit" variant="outlined" {...register("mui-input-2")} />
      <TextField id="outlined-basic" label="Digit" variant="outlined" {...register("mui-input-3")} />
      <Input placeholder='Basic usage' {...register("chakra-ui")} /> */}
    </>
  );
};

export default OTPInput;
