import React from "react";

import { Packlist, UserItem, UserState } from "../types";
import { ApolloCache, OperationVariables, QueryResult, useMutation } from "@apollo/client";
import { InitialStateResponse } from "../App";
import UserItemsForm from "./UserItemsForm";
import { Box, Button, makeStyles } from "@material-ui/core";
import PacklistSelector from "./PacklistSelector";
import PacklistForm from "./PacklistForm";
import { Formik } from "formik";
import { UPDATE_STATE } from "../graphql/mutations";
import { GET_INITIAL_STATE } from "../graphql/queries";
import { useHistory } from "react-router-dom";

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

export interface UpdateStateInput {
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
  const userItems = initialStateQuery.data?.getAuthorizedUser.userItems || [];
  const packlists = initialStateQuery.data?.getAuthorizedUser.packlists || [];
  const currentPacklist = packlists.find(p => p.id === currentPacklistId);
  const history = useHistory();

  const classes = useStyles();

  const [updateState] = useMutation<
    UpdateStateResponse,
    UpdateStateInput
  >(UPDATE_STATE);

  if (!user || initialStateQuery.loading || initialStateQuery.error) {
    return null;
  }

  const mutationCacheUpdate = (
    store: ApolloCache<UpdateStateResponse>,
    values: UpdateStateInput,
  ) => {
    const existingState = store.readQuery<InitialStateResponse>({ query: GET_INITIAL_STATE });
    if (!existingState) {
      return;
    }
    const updatedPacklists = existingState
      .getAuthorizedUser
      .packlists.map(p => p.id === values.packlist.id ? values.packlist : p);

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
  };

  const handleSubmit = async (values: UpdateStateInput) => {
    try {
      await updateState({
        variables: { userItems: values.userItems, packlist: values.packlist },
        update: store => mutationCacheUpdate(store, values),
      }
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Box className={classes.topbar}>
        <div className={classes.topbarItem}>UserID: {user.id}</div>
        <div className={classes.topbarItem}>Username: {user.username}</div>
        <div className={classes.topbarItem}>Email: {user.email}</div>
        <Button onClick={logout}>Logout</Button>
        <Button onClick={() => history.replace("/change-password")}>Change password</Button>
      </Box>

      {!currentPacklist &&
        <PacklistSelector packlists={packlists} setCurrentPacklistId={setCurrentPacklistId} />
      }
      {currentPacklist &&
        <Formik
          key="outerFormik"
          validateOnChange={false}
          validateOnBlur={false}
          initialValues={{ userItems, packlist: currentPacklist }}
          onSubmit={handleSubmit}
        >
          {formikProps => (
            <>
              <PacklistForm />
              <UserItemsForm />
              <Button key="submitButton" variant="contained" onClick={formikProps.submitForm}>Update</Button>
            </>
          )}
        </Formik>
      }
    </>
  );
};

export default LoggedIn;