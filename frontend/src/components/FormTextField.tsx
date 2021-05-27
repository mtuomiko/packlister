import { TextField, TextFieldProps } from "@material-ui/core";
import React from "react";
import { useFormContext } from "react-hook-form";

// const FormTextField = (props: FieldProps & TextFieldProps) => {
//   const { field, form, meta, ...rest } = props;

//   return (
//     <TextField
//       {...field}
//       {...rest}
//     />
//   );
// };

const FormTextField = (props: TextFieldProps & { name: string }) => {
  const { register } = useFormContext();
  const { name, ...rest } = props;
  const { ref: inputRef, ...inputProps } = register(name);

  return (
    <TextField
      inputRef={inputRef}
      {...inputProps}
      {...rest}
    />
  );
};

export default FormTextField;