import React from "react";

import { Packlist, UserItem, UserState } from "../types";
import { OperationVariables, QueryResult, useMutation } from "@apollo/client";
import { InitialStateResponse } from "../App";
import UserItemsForm from "./UserItemsForm";
import { Box, Button, makeStyles } from "@material-ui/core";
import PacklistSelector from "./PacklistSelector";
import PacklistForm from "./PacklistForm";
import { Formik } from "formik";
import { UPDATE_STATE } from "../graphql/mutations";
import { GET_INITIAL_STATE } from "../graphql/queries";

const useStyles = makeStyles((theme) => ({
  topbar: {
    display: "flex",
    justifyContent: "flex-end"
  },
  topbarItem: {
    margin: theme.spacing(1)
  }
}));

interface UpdateStateResponse {
  success: boolean;
}

interface UpdateStateInput {
  userItems: UserItem[];
  packlist: Packlist;
}

interface LoggedInProps {
  logout: () => void;
  user: UserState | undefined;
  initialStateQuery: QueryResult<InitialStateResponse, OperationVariables>;
  currentPacklistId: string;
  setCurrentPacklistId: React.Dispatch<React.SetStateAction<string>>;
}

const LoggedIn = ({
  logout,
  user,
  initialStateQuery,
  currentPacklistId,
  setCurrentPacklistId
}: LoggedInProps) => {
  const [updateState] = useMutation<
    UpdateStateResponse,
    UpdateStateInput
  >(UPDATE_STATE,
    // {
    //   refetchQueries: [{ query: GET_INITIAL_STATE }],
    // }
  );
  const userItems = initialStateQuery.data?.getAuthorizedUser.userItems || [];
  const packlists = initialStateQuery.data?.getAuthorizedUser.packlists || [];

  const classes = useStyles();

  if (!user || initialStateQuery.loading || initialStateQuery.error) {
    return null;
  }

  const Content = () => {
    if (!currentPacklistId) {
      return <PacklistSelector packlists={packlists} setCurrentPacklistId={setCurrentPacklistId} />;
    }
    const packlist = packlists.find(p => p.id === currentPacklistId);
    if (!packlist) {
      return <PacklistSelector packlists={packlists} setCurrentPacklistId={setCurrentPacklistId} />;
    }

    return (
      <Formik
        key="outerFormik"
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{ userItems, packlist }}
        onSubmit={async (values) => {
          try {
            await updateState({
              variables: { userItems: values.userItems, packlist: values.packlist },
              update: (store, response) => {
                const existingState = store.readQuery<InitialStateResponse>({ query: GET_INITIAL_STATE });
                if (!existingState) {
                  return;
                }
                const updatedPacklists = existingState
                  .getAuthorizedUser
                  .packlists.map(p => p.id === values.packlist.id ? values.packlist : p);
                console.log(updatedPacklists);
                console.log(values.userItems);
                store.writeQuery({
                  query: GET_INITIAL_STATE,
                  data: {
                    getAuthorizedUser: {
                      id: user.id,
                      userItems: values.userItems,
                      packlists: updatedPacklists,
                    }
                  }
                });
              }
            });
          } catch (e) {
            console.log(e);
          }
        }}
      >
        {
          formikProps => (
            <>
              <PacklistForm formikProps={formikProps} />
              <UserItemsForm formikProps={formikProps} />
              <Button key="submitButton" variant="contained" onClick={formikProps.submitForm}>Update</Button>
            </>
          )
        }
      </Formik>
    );
  };

  return (
    <>
      <Box className={classes.topbar}>
        <div className={classes.topbarItem}>UserID: {user.id}</div>
        <div className={classes.topbarItem}>Username: {user.username}</div>
        <div className={classes.topbarItem}>Email: {user.email}</div>
        <Button onClick={logout}>Logout</Button>
      </Box>

      <Content />
    </>
  );
};

export default LoggedIn;