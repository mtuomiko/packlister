import React from "react";
import { useMutation } from "@apollo/client";
import { Button, IconButton, TextField } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { Formik, FieldArray, FieldArrayRenderProps, Form } from "formik";
import { nanoid } from "nanoid";

import { UPDATE_USERITEMS } from "../graphql/mutations";
import { UserItem } from "../types";

interface UserItemsFormProps {
  userItems: UserItem[];
}

interface UserItemsUpdateResponse {
  success: boolean;
}

const UserItemsForm = ({ userItems }: UserItemsFormProps) => {
  const [updateUserItems, result] = useMutation<
    UserItemsUpdateResponse,
    UserItemsFormProps
  >(UPDATE_USERITEMS);

  const addItem = (helpers: FieldArrayRenderProps) => {
    const newItem: UserItem = {
      internalId: nanoid(),
      name: "",
      description: "",
      weight: 0,
    };
    helpers.push(newItem);
  };

  return (
    <Formik
      initialValues={{ userItems }}
      onSubmit={async (values, actions) => {
        console.log("submitting, going to call update mutation");
        console.log(values);
        // @ts-ignore: Just get it working. TODO: Figure something out, maybe Apollo middleware?
        const omitTypename = (key, value) => (key === "__typename" ? undefined : value);
        const userItemsWithoutTypename = JSON.parse(JSON.stringify(values.userItems), omitTypename);
        try {
          const { data } = await updateUserItems({ variables: { userItems: userItemsWithoutTypename } });
          console.log(data);
        } catch (e) {
          console.log(e);
        } finally {
          console.log("submit finally branch, setting submitting to false");
          actions.setSubmitting(false);
        }
      }}
    >
      {props => (
        <Form>
          <FieldArray name="userItems"
            render={(arrayHelpers) => (
              <div>
                {props.values.userItems.map((item, index) => (
                  <div key={item.internalId}>
                    <TextField
                      name={`userItems.${index}.name`}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={item.name}
                    />
                    <TextField
                      name={`userItems.${index}.description`}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={item.description}
                    />
                    <TextField
                      name={`userItems.${index}.weight`}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                      value={item.weight}
                      type="number"
                    />
                    <IconButton aria-label="delete" onClick={() => arrayHelpers.remove(index)}>
                      <Delete />
                    </IconButton>
                  </div>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => addItem(arrayHelpers)}
                >Add item</Button>
              </div>
            )}
          />
          <Button variant="contained" type="submit">Save</Button>
        </Form>
      )}
    </Formik>
  );
};

export default UserItemsForm;