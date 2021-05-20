import React from "react";
import { IconButton, TextField, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { FieldArray, FieldArrayRenderProps, Form, useFormikContext } from "formik";

import { UpdateStateInput } from "./LoggedIn";

const UserItemsForm = () => {
  const formikContext = useFormikContext<UpdateStateInput>();
  const removeItem = (helpers: FieldArrayRenderProps, index: number) => {
    const userItem = formikContext.values.userItems[index];
    const categories = formikContext.values.packlist.categories;

    const newCategories = categories.map(c => {
      const { categoryItems, ...rest } = c;
      const newCategoryItems = categoryItems.filter(i => i.userItemId !== userItem.internalId);
      return {
        ...rest,
        categoryItems: newCategoryItems,
      };
    });

    formikContext.setFieldValue("packlist.categories", newCategories);
    helpers.remove(index);
  };

  return (
    <div>
      <Typography variant="h4">User items</Typography>
      <Form>
        <FieldArray name="userItems"
          render={(arrayHelpers) => (
            <div>
              {formikContext.values.userItems.map((item, index) => (
                <div key={item.internalId}>
                  <TextField
                    value={item.name}
                  />
                  <TextField
                    value={item.description}
                  />
                  <TextField
                    value={item.weight}
                  />
                  <IconButton aria-label="delete" onClick={() => removeItem(arrayHelpers, index)}>
                    <Delete />
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        />
      </Form>
    </div>
  );
};

export default UserItemsForm;