import React from "react";
import { Packlist, UserItem } from "../types";
import { ApolloCache, OperationVariables, QueryResult, useMutation } from "@apollo/client";
import { Formik } from "formik";
import { UPDATE_STATE } from "../graphql/mutations";
import { GET_INITIAL_STATE } from "../graphql/queries";
import { InitialStateResponse } from "../App";
import MainDisplay from "./MainDisplay";

interface UpdateStateResponse {
  success: boolean;
}

export interface UpdateStateInput {
  userItems: UserItem[];
  packlists: Packlist[];
}

interface LoggedInProps {
  initialStateQuery: QueryResult<InitialStateResponse, OperationVariables>;
}

const LoggedIn = ({ initialStateQuery }: LoggedInProps) => {
  const [updateState] = useMutation<
    UpdateStateResponse,
    UpdateStateInput
  >(UPDATE_STATE);

  const user = initialStateQuery.data?.getAuthorizedUser;
  if (initialStateQuery.loading || initialStateQuery.error || !user) {
    return null;
  }

  const userItems = user.userItems;
  const packlists = user.packlists;

  const mutationCacheUpdate = (
    store: ApolloCache<UpdateStateResponse>,
    values: UpdateStateInput,
  ) => {
    const existingState = store.readQuery<InitialStateResponse>({ query: GET_INITIAL_STATE });
    if (!existingState) {
      return;
    }

    store.writeQuery({
      query: GET_INITIAL_STATE,
      data: {
        getAuthorizedUser: {
          id: user.id,
          username: user.username,
          email: user.email,
          userItems: values.userItems,
          packlists: values.packlists,
        }
      }
    });
  };

  const handleSubmit = async (values: UpdateStateInput) => {
    try {
      await updateState({
        variables: { userItems: values.userItems, packlists: values.packlists },
        update: store => mutationCacheUpdate(store, values),
      }
      );
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Formik
      key="outerFormik"
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{ userItems, packlists }}
      onSubmit={handleSubmit}
    >
      {formikProps => (
        <MainDisplay />
      )}
    </Formik>
  );
};

export default LoggedIn;