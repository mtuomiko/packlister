import React from "react";
import { Button, IconButton, TextField, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { FieldArray, FieldArrayRenderProps, Form, FormikProps } from "formik";
import { nanoid } from "nanoid";

import { Packlist, UserItem } from "../types";

interface UserItemsFormProps {
  formikProps: FormikProps<{
    userItems: UserItem[];
    packlist: Packlist;
  }>;
}

const UserItemsForm = ({ formikProps }: UserItemsFormProps) => {
  const addItem = (helpers: FieldArrayRenderProps) => {
    const newItem: UserItem = {
      internalId: nanoid(),
      name: "",
      description: "",
      weight: 0,
      __typename: "UserItem",
    };
    helpers.push(newItem);
  };

  return (
    // <Formik
    //   initialValues={{ userItems }}
    //   onSubmit={async (values, actions) => {
    //     // @ts-ignore: Just get it working. TODO: Figure something out, maybe Apollo middleware?
    //     const omitTypename = (key, value) => (key === "__typename" ? undefined : value);
    //     const userItemsWithoutTypename = JSON.parse(JSON.stringify(values.userItems), omitTypename);
    //     try {
    //       await updateUserItems({ variables: { userItems: userItemsWithoutTypename } });
    //     } catch (e) {
    //       console.log(e);
    //     } finally {
    //       actions.setSubmitting(false);
    //     }
    //   }}
    // >
    <div>
      <Typography variant="h4">User items</Typography>
      <Form>
        <FieldArray name="userItems"
          render={(arrayHelpers) => (
            <div>
              {formikProps.values.userItems.map((item, index) => (
                <div key={item.internalId}>
                  <TextField
                    name={`userItems.${index}.name`}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={item.name}
                  />
                  <TextField
                    name={`userItems.${index}.description`}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={item.description}
                  />
                  <TextField
                    name={`userItems.${index}.weight`}
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
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
      </Form>
    </div>
    // </Formik>
  );
};

export default UserItemsForm;