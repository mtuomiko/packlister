import { TextField, TextFieldProps } from "@material-ui/core";
import { FieldProps } from "formik";
import React from "react";

const FormTextField = (props: FieldProps & TextFieldProps) => {
  const { field, form, meta, ...rest } = props;

  return (
    <TextField
      {...field}
      {...rest}
    />
  );
};

export default FormTextField;