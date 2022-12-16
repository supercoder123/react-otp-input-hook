import { renderHook } from '@testing-library/react';
import { useOtpInput } from '..';


/**
 * check for all types of objects returned from useOtpInput
 * register, clear, setDisabled, setValue, value, error, setError, inputs 
 * 
 * check for console.error and console.warn
 * 
 * 
 * 
 */

describe("useOtpInput tests", () => {
    test("Initialization", () => {
        const { result } = renderHook(() => useOtpInput());
        expect(typeof result.current.register).toBe('function');
        expect(typeof result.current.clear).toBe('function');
        expect(typeof result.current.setDisabled).toBe('function');
        expect(typeof result.current.value).toBe('string');
        expect(typeof result.current.inputs).toBe('object');
    });
});