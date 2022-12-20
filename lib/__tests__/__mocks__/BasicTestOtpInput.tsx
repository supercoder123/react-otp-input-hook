import React, { useEffect, useState } from "react";
import { useOtpInput } from "../..";

interface Props {
  onInputValueChange?: ((val: string) => void) | undefined;
  onSubmit?: (e: React.FormEvent) => void;
  blankAllowed?: boolean;
  type?: "alphanumeric" | "numeric" | "password" | "password-numeric" ;
}

export function BasicTestOtpInput({ onInputValueChange, onSubmit, blankAllowed,  type = 'alphanumeric' }: Props) {
  const [ disabled, setInputDisabled ] = useState(false);
  const { register, clear, setDisabled, setValue, value, error, setError } =
    useOtpInput<HTMLInputElement>({
      type,
      focusOnLoad: true,
      placeholder: "*",
      onInputValueChange,
      blankAllowed
    });

  useEffect(() => {
    setDisabled(disabled);
  }, [disabled]);

  const registerOptions = {
    required: true,
  };

  return (
    <>
      <form role="form" onSubmit={onSubmit}>
        <div data-testid="container" className={error ? "error" : ""}>
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

        <h5>{value}</h5>

        <div data-testid="error-msg">{error}</div>

        <button type="button" onClick={() => clear()}>
          Clear
        </button>
        <button
          type="button"
          onClick={() => {
            setInputDisabled((prev) => !prev);
          }}
        >
          Disable
        </button>
        <button type="button" onClick={() => setValue("948983")}>
          Set Value
        </button>
        <button type="button" onClick={() => setError("OTP ERROR")}>
          Set Error
        </button>

      </form>
    </>
  );
}
