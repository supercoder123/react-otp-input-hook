import React from "react";
import { cleanup, renderHook } from "@testing-library/react";
import { useOtpInput } from "..";
import { fireEvent, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

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
    const { getByText, getAllByRole, getByRole } = render(
      <BasicTestOtpInput
        onInputValueChange={onInputValueChange}
        onSubmit={onSubmit}
      />
    );

    const inputs = getAllByRole("textbox");

    // focus
    expect(document.activeElement).toBe(inputs[0]);

    // onInputValueChange
    const inputText = "12345";
    await user.keyboard(inputText);
    expect(onInputValueChange).toHaveBeenCalledTimes(5);
    expect(onInputValueChange.mock.calls.length).toBe(5);

    function testInput() {
      let text = "";
      inputText.split("").forEach((char, i) => {
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
      expect((input as HTMLInputElement).placeholder).toBe("*");
    });

    // type
    inputs.forEach((input, i) => {
      expect((input as HTMLInputElement).type).toBe("text");
    });

    // onSubmit
    const submitButton = getByRole("button", { name: /Submit/i });

    await user.click(submitButton);
    expect(onSubmit).toHaveBeenCalled();

    // clear
    const clear = getByText(/Clear/i);
    await user.click(clear);

    inputs.forEach((input, i) => {
      expect((input as HTMLInputElement).value).toBe("");
    });

    // onSubmit on empty inputs
    onSubmit.mockClear();
    await user.click(submitButton);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  test("Check returned props from useOtpInput Hook", async () => {
    const { getByText, getAllByRole, getByRole, getByTestId } = render(
      <BasicTestOtpInput />
    );
    const user = userEvent.setup();

    const inputs = getAllByRole("textbox");
    const numOfInputs = inputs.length;

    inputs.forEach((input, i) => {
      expect((input as HTMLInputElement).disabled).toBe(false);
    });

    // setDisabled
    const disableButton = getByRole("button", { name: /Disable/i });
    await user.click(disableButton);

    inputs.forEach((input, i) => {
      expect((input as HTMLInputElement).disabled).toBe(true);
    });

    await user.click(disableButton);

    inputs.forEach((input, i) => {
      expect((input as HTMLInputElement).disabled).toBe(false);
    });

    // setValue
    inputs.forEach((input, i) => {
      expect((input as HTMLInputElement).value).toBe("");
    });

    const setValueButton = getByRole("button", { name: /Set Value/i });
    await user.click(setValueButton);

    const inputText = "948983";
    inputs.forEach((input, i) => {
      expect((input as HTMLInputElement).value).toBe(inputText[i]);
    });

    // value
    const heading = getByRole("heading");
    expect((heading as HTMLHeadingElement).textContent).toBe(
      inputText.slice(0, numOfInputs)
    );

    await user.click(inputs[0]);

    expect(document.activeElement).toBe(inputs[0]);
    expect((inputs[0] as HTMLInputElement).selectionEnd).toBe(1);
    (inputs[0] as HTMLInputElement).setSelectionRange(0, 1)

    const inputNum = "p6789";


    inputs.forEach(async (input, i) => {
      await userEvent.clear(input);
      await user.keyboard(inputNum[i]);
      expect((input as HTMLInputElement).value).toBe(inputNum[i]);
    });
    expect(document.activeElement).toBe(inputs[4]);

    // error
    const error = screen.getByTestId('error-msg');
    expect(error).toHaveTextContent('');
    expect(error).not.toHaveTextContent('OTP ERROR');

    // setError
    const errorButton = getByRole("button", { name: /Set Error/i });
    fireEvent.click(errorButton);

    expect(error).toHaveTextContent('OTP ERROR');

    // on paste
    let pasteText = 'paste';
    const clear = getByText(/Clear/i);
    await user.click(clear);
    await user.click(inputs[0]);

    userEvent.paste(pasteText);
    inputs.forEach(async (input, i) => {
      expect((input as HTMLInputElement).value).toBe(pasteText[i]);
    });

    await user.click(clear);
    await user.click(inputs[0]);

    pasteText = 'hello';
    userEvent.paste(pasteText);
    inputs.forEach(async (input, i) => {
      expect((input as HTMLInputElement).value).toBe(pasteText[i]);
    });
  });

  test("Check for keyboard navigation", async () => {
    const { rerender } = render(<BasicTestOtpInput />);
    const user = userEvent.setup();

    const inputs = screen.getAllByRole("textbox");
    const numOfInputs = inputs.length;

    expect(document.activeElement).toBe(inputs[0]);

    for (let i=0; i<inputs.length - 1; i++) {
      await user.keyboard('{ArrowRight}');
      expect(document.activeElement).toBe(inputs[i + 1]);
    }

    expect(document.activeElement).toBe(inputs[4]);

    for (let i=inputs.length - 1; i>0; i--) {
      await user.keyboard('{ArrowLeft}');
      expect(document.activeElement).toBe(inputs[i - 1]);
    }

    expect(document.activeElement).toBe(inputs[0]);

    await user.keyboard('{Tab}');
    expect(document.activeElement).toBe(inputs[1]);

    await user.keyboard('{Backspace}');
    expect(document.activeElement).toBe(inputs[0]);
    expect((inputs[1] as HTMLInputElement).value).toBe('');

    expect((inputs[0] as HTMLInputElement).value).toBe('');

    await user.keyboard('[Space]');
    expect(document.activeElement).toBe(inputs[0]);

    rerender(<BasicTestOtpInput blankAllowed />);
    await user.keyboard('[Space]');
    expect((inputs[0] as HTMLInputElement).value).toBe(' ');

    expect(document.activeElement).toBe(inputs[1]);

    await user.keyboard('[Space]');
    expect(document.activeElement).toBe(inputs[2]);
  });

  test('Check for numeric input types', async () => {
    const { getAllByRole } = render(<BasicTestOtpInput type={'numeric'} />);
    const user = userEvent.setup();

    const inputs = getAllByRole("textbox");
    const numOfInputs = inputs.length;
    expect((inputs[0] as HTMLInputElement).type).toBe('tel');
    expect((inputs[1] as HTMLInputElement).type).toBe('tel');
    expect((inputs[2] as HTMLInputElement).type).toBe('tel');

    await user.keyboard('&*^*((*');
    expect(document.activeElement).toBe(inputs[0]);
  });

  test('Check for password types', async () => {
    const { getAllByRole, getByText } = render(<BasicTestOtpInput type={'password-numeric'} />);
    const user = userEvent.setup();

    // getbyrole not working for password inputs
    const inputs = screen.getAllByPlaceholderText('*');
    expect((inputs[0] as HTMLInputElement).type).toBe('password');
    expect((inputs[1] as HTMLInputElement).type).toBe('password');
    expect((inputs[2] as HTMLInputElement).type).toBe('password');

    await user.keyboard('&*^*((*');
    expect(document.activeElement).toBe(inputs[0]);
  });

  test("Check for input array", () => {
    const Component = () => {
      const { inputs } = useOtpInput({
        numberOfInputs: 5,
      });
      return (
        <>
          {
            inputs.map((input, i) => {
              return <input key={i} {...input} />;
            })
          }
        </>
      );
    };

    render(<Component />);

    const inputs = screen.getAllByRole("textbox");
    const numOfInputs = inputs.length;

    expect(screen.getAllByRole('textbox').length).toBe(5);
    expect(document.activeElement).not.toBe(inputs[0]);
  });
});
