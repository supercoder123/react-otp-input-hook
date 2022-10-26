 

```
const otp = () => {
    const { register, clear, setDisabled, setValue, inputState, value } = useInputSync({
        type: 'numeric',
        onInputValueChange: () => {},
        blankAllowed: true,
        focusOnLoad: true,
        cycle: false,
        defaultInlineStyles: {
            width: '80px',
            height: '40px',
            fontSize: '20px',
            textAlign: 'center',
            border: 'none',
            borderBottom: '1px solid black'
        }
    });
    return (
        <>
            <input {...register('one', { maxLength: 3, required: true })} />
            <input {...register('two', { maxLength: 1, required: true })})} />
            <input {...register('three')} />
            <input {...register('four')} />
        </>
    )
}
```

## TODO  

1. basic implementation [X]
2. keyboard handling [X]
3. basic on change handler and value [X]
4. aria accessibility
5. input ordering
6. multiple max length [X]
7. error handling - not needed
8. placeholder support [X]
9. regex pattern support
10. cyclable [X]
11. setValue [X]
12. usage with chakra ui [X]
13. usage with material ui [X]
14. usage with react-hook-form [X]
