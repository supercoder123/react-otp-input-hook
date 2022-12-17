import React from 'react';
import { useOtpInput } from "../..";

interface Props {
  onInputValueChange?: ((val: string) => void) | undefined;
  onSubmit?: (e: React.FormEvent) => void;
}

export function BasicTestOtpInput({ onInputValueChange, onSubmit }: Props) {
  const { register, clear, setDisabled, setValue, value, error, setError } = useOtpInput<HTMLInputElement>({
    type: 'alphanumeric',
    focusOnLoad: true,
    placeholder: '*',
    onInputValueChange
  });

  const registerOptions = {
    required: true,
  }

  return (
    <>
       <form role="form" onSubmit={onSubmit}>

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

        <button>Submit</button>

        <button type='button' onClick={() => clear()}>Clear</button>
        <button type='button' onClick={() => setDisabled(true)}>Disable</button>

      </form>
    </>
  )
}