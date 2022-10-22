import React, { useEffect, useRef, useState } from 'react';

/**
 * 

  const {register, setDisabled } = useOtpInput({
    length: 4, 
    separator: '*',
    otpType: any|number|alpha|alphanumeric,
    secure: false,
  });

  <input {...register()} />
  <input {...register()} />
  <input {...register()} />
  <input {...register()} />

*/

const combineValues = (obj: any) => {
  return Object.values(obj).join('');
};

const useOtpInput = ({ length, secure }: { length: number; secure?: true }) => {
  // const inputFields: React.RefObject<HTMLInputElement>[] = [];
  const inputFields = useRef<HTMLInputElement[]>([]);

  const [activeInputNumber, setActiveInputNumber] = useState(0);
  const [value, setInputValue] = useState('');
  let num = 0;

  let map = {
    value: '',
    inputValues: {},
  };

  console.log('useOtpInput', inputFields);

  useEffect(() => {
    inputFields.current[num].focus();
    return () => {
      console.log('useOtpInput unmount', inputFields);
    };
  }, []);

  const register = (label: string) => {
    if (inputFields.current.length >= length) {
      throw new Error(`Can register only ${length} inputs`);
    }

    // inputFields.forEach((x) => {
    //   console.log(x);
    // });

    console.log('register', inputFields);

    // setInputValuesMap((prevValueMap) => {
    //   return { ...prevValueMap, label: 'asd' };
    // });

    return {
      ref: (element: HTMLInputElement) => inputFields.current.push(element),
      name: label,
      type: secure ? 'password' : 'text',
      maxLength: 1,
    };
  };

  const handleOnChange = (handler: (data: unknown) => void) => {
    console.log('sfd');
    return (e: React.FormEvent<HTMLDivElement>) => {
      console.log(e);
      const el = e.target as HTMLInputElement;
      map = {
        inputValues: {
          ...map.inputValues,
          [el.name]: el.value,
        },
        value: combineValues(map.inputValues)
      };
      // setInputValue(combineValues(map));
      // console.log(map);
      handler(map);
    };
  };

  const registerGroup = (label: string, config: any) => {
    return {
      onChange: (e: React.FormEvent<HTMLDivElement>) => {
        const target = e.target as HTMLInputElement;
        map = {
          inputValues: {
            ...map.inputValues,
            [target.name]: target.value,
          },
        value: combineValues(map.inputValues)
        };
        // setInputValue(combineValues(map));
        // console.log(map);
        config.onChange(map);
      },
      onKeyUp: (e: React.KeyboardEvent) => {
        if (num < length - 1 && e.keyCode !== 8) {
          console.log(e.which, e.keyCode, num);
          // inputFields.current[num].blur();
          num = num + 1;
          console.log(inputFields.current[0]);
          inputFields.current[num].focus();
        }

        if (e.keyCode === 8 && num > 0) {
          console.log('df');
          num = num - 1;
          inputFields.current[num].focus();
        }

        // inputFields.current[2].focus();
      },
    };
  };

  return {
    register,
    value,
    registerGroup,
  };
};

export const ReactOtpInput = () => {
  const { register, registerGroup } = useOtpInput({
    length: 3,
    secure: true,
  });

  // useEffect(() => {
  //   console.log('updated value', value);
  // }, [value]);

  console.log('ReactOtpInput');
  const onChange = (data: unknown) => {
    console.log('no', data);
  };

  return (
    <>
      <div
        {...registerGroup('groupOne', {
          onChange,
        })}
      >
        <input  {...register('one')} />
        *
        <input {...register('two')} />
        *
        <input {...register('three')} />
      </div>

      {/* <input type="text" {...register('four')} /> */}
    </>
  );
};
