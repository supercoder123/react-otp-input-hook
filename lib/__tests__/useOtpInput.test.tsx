import React from 'react';
import { renderHook } from "@testing-library/react";
import { useOtpInput } from "..";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  getByTestId,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event'


import { BasicTestOtpInput } from "./__mocks__/BasicTestOtpInput";

/**
 * check for all types of objects returned from useOtpInput
 * register, clear, setDisabled, setValue, value, error, setError, inputs
 *
 * check for console.error and console.warn
 *
 * check for all input hook params
 *
 */

describe("useOtpInput tests", () => {
  const warn = console.warn;
  beforeEach(() => {
    console.warn = jest.fn();
  });
  afterAll(() => {
    console.warn = warn;
  });

  test("Initialization", () => {
    const { result } = renderHook(() => useOtpInput());
    expect(typeof result.current.register).toBe("function");
    expect(typeof result.current.clear).toBe("function");
    expect(typeof result.current.setDisabled).toBe("function");
    expect(typeof result.current.setValue).toBe("function");
    expect(typeof result.current.error).toBe("string");
    expect(typeof result.current.setError).toBe("function");
    expect(typeof result.current.value).toBe("string");

    // console.warn is called since numOfInputs is not provided
    expect(typeof result.current.inputs).toBe("object");
    expect(console.warn).toHaveBeenCalled();
  });

  test("Basic Component Render", async () => {
    const user = userEvent.setup();
    const onInputValueChange = jest.fn((val: string) => val);
    const onSubmit = jest.fn((e: React.FormEvent) => e.preventDefault());

    /**
     *  Props ----
        type: 'alphanumeric',
        focusOnLoad: true,
        placeholder: '*',
        onInputValueChange(val) {
          // console.log(val)
        },
     */
    const { getByText, getAllByRole, getByRole } = render(<BasicTestOtpInput onInputValueChange={onInputValueChange} onSubmit={onSubmit} />);

    const inputs = getAllByRole('textbox');

    // focus
    expect(document.activeElement).toBe(inputs[0]);

    // onInputValueChange
    const inputText = '12345';
    await user.keyboard(inputText);
    expect(onInputValueChange).toHaveBeenCalledTimes(5);
    expect(onInputValueChange.mock.calls.length).toBe(5);

    function testInput() {
      let text = '';
      inputText.split('').forEach((char, i) => {
        text += char;
        expect(onInputValueChange.mock.calls[i][0]).toBe(text);
      });
    }

    testInput();

    // input values
    inputs.forEach((input, i) => {
      expect((input as HTMLInputElement).value).toBe(inputText[i]);
    });

    expect(document.activeElement).toBe(inputs[inputs.length - 1]);

    // placeholder
    inputs.forEach((input, i) => {
      expect((input as HTMLInputElement).placeholder).toBe('*');
    });

    // type
    inputs.forEach((input, i) => {
      expect((input as HTMLInputElement).type).toBe('text');
    });

    // onSubmit
    const submitButton = getByRole('button', { name: /Submit/i });

    await user.click(submitButton);
    expect(onSubmit).toHaveBeenCalled();

    // clear
    const clear = getByText(/Clear/i);
    await user.click(clear);

    inputs.forEach((input, i) => {
      expect((input as HTMLInputElement).value).toBe('');
    });

    // onSubmit on empty inputs
    onSubmit.mockClear();
    await user.click(submitButton);
    expect(onSubmit).not.toHaveBeenCalled();
  });

});
