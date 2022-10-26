import React, { useEffect, useState } from "react";
import useInputSync from "../../lib/useInputSync";
import TextField from '@mui/material/TextField';
import './style.css';
import { useForm } from "react-hook-form";
import { Input } from '@chakra-ui/react'

const OTPInput = ({ onChangeHandler, maxLength }: any) => {
  const { register, clear, setDisabled, setValue, inputState, value } = useInputSync({
    // type: 'password',
    onInputValueChange: onChangeHandler,
    blankAllowed: true,
    focusOnLoad: true,
    cycle: true,
    defaultInlineStyles: {
      width: '80px',
      height: '40px',
      fontSize: '20px',
      textAlign: 'center',
      border: 'none',
      borderBottom: '1px solid black'
    }
  });

  const [error, seterror] = useState(false);

  useEffect(() => {
    // seterror(true);
    console.log('state', inputState)
  }, [inputState])

  // useEffect(() => {
  //   setValue('9380934232343')
  // }, []);

  // useEffect(() => {
  //   console.log('value', value)
  // }, [value]);


  const inputs: JSX.Element[] = [];
  // for (let i = 0; i < maxLength; i++) {
  //   const classNm = `otp-input ${error ? 'error' : ""}`
  //   inputs.push(<input key={i} className={classNm} {...register(`name-${i}`)} />);
  // }

  return (
    <>
    <form onSubmit={(e) => {
      e.preventDefault()
      console.log(value)
    }}>
      <div style={{ display: "flex", alignItems: 'center', justifyContent: 'space-between', maxWidth: '500px' }}>
        <input placeholder="-" required {...register("one", { required: true })} />
        *
        <input placeholder="-" {...register("two")} />
        *
        <input placeholder="-" {...register("c")} />
        *
        <input placeholder="-" {...register("d")} />
        *
        <input placeholder="-" {...register("d")} />
        {inputs}
        {/* <input placeholder="fd" className="otp-input" {...register("twfo", {maxLength: 3})} /> */}
      </div>
      <div style={{height: "20px"}}>{value}</div>
      <button type="button" onClick={() => { clear() }}>Clear</button>
      <button>Submit</button>
      {/* <TextField id="outlined-basic" label="Digit" variant="outlined" {...register("mui-input")} />
      <TextField id="outlined-basic" label="Digit" variant="outlined" {...register("mui-input-1")} />
      <TextField id="outlined-basic" label="Digit" variant="outlined" {...register("mui-input-2")} />
      <TextField id="outlined-basic" label="Digit" variant="outlined" {...register("mui-input-3")} />
      <Input placeholder='Basic usage' {...register("chakra-ui")} /> */}
      </form>
    </>
  );
};

export default OTPInput;
