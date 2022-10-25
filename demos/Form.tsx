import { useForm, Controller } from "react-hook-form";
import React, { useEffect, useState } from "react";
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
        console.log('va',v)
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
  const onSubmit = (data: any) => console.log('data', data, value);

//   console.log(watch("example")); // watch input value by passing the name of it
// console.log(registerInput('adf'), register('adf'))
  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}
      {/* <input defaultValue="test" {...register("example")} /> */}
      
      <Controller
        name="example"
        control={control}
        render={({ field }) => <TextField label="adsfsd" {...field} {...registerInput('register-one')} />}
      />

    <Controller
        name="exampleTwo"
        control={control}
        render={({ field }) => <TextField {...field} {...registerInput('register-two')} />}
      />
      {/* include validation with required or other standard HTML validation rules */}
      {/* <input {...register("exampleRequired", { required: true })} /> */}

      <Controller
        name="exampleThree"
        control={control}
        rules={{required: true}}
        render={({ field }) => <TextField {...field} {...registerInput('register-three')} />}
      />

      {/* <input {...register("exampleRequired", { required: true })}  /> */}

      {/* errors will return when field validation fails  */}
      {errors.exampleThree && <span>This field is required</span>}
      
      <input type="submit" />
    </form>
  );
}
