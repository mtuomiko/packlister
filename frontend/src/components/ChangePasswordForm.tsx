import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { Button, Container, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { CHANGE_PASSWORD } from "../graphql/mutations";
import { useHistory } from "react-router-dom";

interface ChangePasswordInput {
  oldPassword: string;
  newPassword: string;
}

const useStyles = makeStyles(theme => ({
  loginContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  inputField: {
    margin: theme.spacing(1, 0),
  },
}));

const ChangePasswordForm = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const history = useHistory();

  const [changePassword, result] = useMutation<
    {
      changePassword: {
        id: string;
      };
    },
    ChangePasswordInput
  >(CHANGE_PASSWORD, {
    onError: (error) => {
      if (error?.graphQLErrors[0]?.message) {
        console.error(error?.graphQLErrors[0]?.message);
      } else {
        console.error(error.message);
      }
    }
  });

  useEffect(() => {
    if (result.data) {
      history.replace("/");
    }
  }, [result.data, history]);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    changePassword({ variables: { oldPassword, newPassword } });
  };

  const classes = useStyles();

  return (
    <Container className={classes.loginContainer}>
      <Typography component="h1" variant="h5">
        Change password
      </Typography>
      <form onSubmit={submit}>
        <TextField
          className={classes.inputField}
          required
          id="old-password"
          label="Old password"
          type="password"
          value={oldPassword}
          onChange={({ target }) => setOldPassword(target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          className={classes.inputField}
          required
          id="new-password"
          label="New password"
          type="password"
          value={newPassword}
          onChange={({ target }) => setNewPassword(target.value)}
          variant="outlined"
          fullWidth
        />
        <Button
          color="primary"
          type="submit"
          variant="contained"
          fullWidth
        >Change</Button>
      </form>
    </Container>
  );
};

export default ChangePasswordForm;