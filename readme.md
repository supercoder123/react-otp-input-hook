<div align="center">
<img width="300" src="./images/lib-logo.svg" alt="React OTP Input Hook" /> 
</div> 

A simple react hook to create otp inputs with ease.  

## Features
- Small size
- Easy to use
- Does not come with any styling so you are free to use any input component of your own. (refs need to be forwarded)
- Written in typescript
- Lots of options
- Works with many libraries

## Basic Usage

```
const BasicOTPComponent = ({ onChange }: { onChange: (val: string) => void }) => {
  const { register } = useOtpInput({
    onInputValueChange: onChange,
  });

  const defaultOptions = { required: true };

  return (
    <div style={{ padding: '10px' }}>
      <input {...register("digit-1", defaultOptions)} />
      <input {...register("digit-2", defaultOptions)} />
      <input {...register("digit-3", defaultOptions)} />
      <input {...register("digit-4", defaultOptions)} />
      <input {...register("digit-5", defaultOptions)} />
    </div>
  );
};
```

## Use Inside any form
```
// styles 

form {
  display: flex;
  flex-direction: column;
}
form input {
  height: 40px;
  font-size: 20px;
  padding: 10px;
  margin-right: 10px;
  margin-left: 10px;
  width: 40px;
  text-align: center;
  font-family: sans-serif;
}
button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
```



```
function App() {
  const [value, setValue] = useState("");

  return (
    <div>
      <form
        style={{ display: "flex", flexDirection: "column" }}
        onSubmit={(e) => {
          e.preventDefault();
          console.log('Value', value);
        }}
      >

        <BasicOTPComponent
          onChange={(value: any) => {
            console.log(value);
            setValue(value);
          }}
        />

        <button
          type="submit"
        >
          Submit
        </button>
      </form>

      <div style={{minHeight: '24px', padding: '10px'}}>{value}</div>
    </div>
  );
}
```


## Output

<center>
  <img width="100%" alt="Basic component output" src="./images/Untitled.gif" />
</center>
