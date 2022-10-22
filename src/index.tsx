import React, { useCallback, useEffect, useState } from 'react';
import { ReactOtpInput } from './hooks/ReactOtpInput';

import { createRoot } from 'react-dom/client';
import useInputSync from './hooks/useInputSync';
import OTPInput from './components/OTPInput';

export const App = () => {
  // const {register, clear, setDisabled, onChange, val} = useInputSync({});
  const [otp, setOtpValue] = useState<string | number>('')

  const onChangeHandler = (vv: any) => {
    setOtpValue(vv);
  }

  const memoizedCallback = useCallback(
    onChangeHandler,
    [],
  );
  

  return (
    <div>
      {/* <form onSubmit={(e) => {
        const formData = new FormData(e.currentTarget);

        e.preventDefault();
        // setDisabled(true);
        clear();
        console.log(e, formData.values())
      }}> */}
        <OTPInput maxLength={4} onChangeHandler={memoizedCallback} />
        {/* <OTPInput maxLength={4}  /> */}

        {/* {otp} */}
      {/* </form> */}
      {/* <ReactOtpInput /> */}
    </div>
  )
}

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);