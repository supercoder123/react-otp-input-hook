import { useOtpInput } from "../lib";

export function OTPInput() {
    const { register, clear, setDisabled, setValue, value, error, setError, inputs } = useOtpInput<HTMLInputElement>({
        type: 'alphanumeric',
        focusOnLoad: true,
        placeholder: '*',
        onInputValueChange(val) {
          console.log(val)
        },
      });
}