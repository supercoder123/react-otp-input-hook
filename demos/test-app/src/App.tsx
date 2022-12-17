import { memo } from 'react'
import { useEffect, useState, useMemo } from 'react';

if (import.meta.hot)
import.meta.hot.accept(() => import.meta.hot.invalidate())

import reactLogo from './assets/react.svg'
import './App.css'
import { useOtpInput } from '../../../lib';

const LoopInput = memo(({ inputs }) => {

  return inputs.map((inputProps, i) => {
    return (
      <input key={i} required {...inputProps} />
    )
  })
})

export function OTPInputBasic() {
  const { register, clear, setDisabled, setValue, value, error, setError, inputs } = useOtpInput<HTMLInputElement>({
    // type: 'alphanumeric',
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
  }

  return (
    <>
      <form onSubmit={(e) => {
        e.preventDefault();
      }}>
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

        <div className='container'>
          {
            memInputs.map((inputProps, i) => {
              return (
                <input className={error ? 'error' : ''} key={i} required {...inputProps} />
              )
            })
          }
          {/* <LoopInput inputs={memInputs}/> */}
        </div>

        <div className="value">Value: {value}</div>
        {/* <div className="value">Value: {sv}</div> */}
        <div className="value">Error: {error}</div>

        <button type="button" onClick={() => { clear(); }}>Clear</button>
        <button type='submit' onClick={() => {
          // console.log('es', sv, sv.toString().length);
          // if (sv.toString().length >= 3) {
          //   setValue(sv.toString())
          // }
        }}>Submit</button>
        <button type="button" onClick={() => { setError('Invalid') }}>SetError</button>
        <button type="button" onClick={() => { setError('') }}>Clear Error</button>
        <button type="button" onClick={() => { setValue('asdbd') }}>Set Value</button>


      </form>
    </>
  );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <OTPInputBasic />
    </div>
  )
}

export default App
