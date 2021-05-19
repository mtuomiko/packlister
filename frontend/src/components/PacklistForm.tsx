import React from "react";
import { Button, IconButton, TextField, makeStyles } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { FieldArray, FieldArrayRenderProps, Form, FormikProps } from "formik";
import { nanoid } from "nanoid";

import { Category, CategoryItem, Packlist, UserItem } from "../types";

const useStyles = makeStyles((theme) => ({
  categoryContainer: {
    margin: theme.spacing(1),
  },
  itemContainer: {
    margin: theme.spacing(1, 2),
  },
}));

interface PacklistFormProps {
  formikProps: FormikProps<{
    userItems: UserItem[];
    packlist: Packlist;
  }>;
  // currentPacklist: Packlist | undefined;
  // setCurrentPacklist: React.Dispatch<React.SetStateAction<Packlist | undefined>>;
}

const PacklistForm = ({ formikProps }: PacklistFormProps) => {
  const addCategory = (helpers: FieldArrayRenderProps) => {
    const newCategory: Category = { internalId: nanoid(), name: "", categoryItems: [] };
    helpers.push(newCategory);
  };

  const addCategoryItem = (helpers: FieldArrayRenderProps) => {
    const newCategoryItem: CategoryItem = { internalId: nanoid(), userItemId: nanoid(), quantity: 0 };
    // Adding a new item so corresponding UserItem needs to created
    const newUserItem: UserItem = {
      internalId: newCategoryItem.userItemId,
      name: "",
      description: "",
      weight: 0,
      __typename: "UserItem",
    };
    helpers.push(newCategoryItem);
    // New UserItem needs to pushed through props
    const userItems = formikProps.values.userItems.concat(newUserItem);
    formikProps.setFieldValue("userItems", userItems);
    console.log(formikProps.values);
  };

  const classes = useStyles();

  return (
    <Form>
      <TextField
        name="packlist.name"
        label="Name"
        onChange={formikProps.handleChange}
        onBlur={formikProps.handleBlur}
        value={formikProps.values.packlist.name}
      />
      <TextField
        name="packlist.description"
        label="Description"
        onChange={formikProps.handleChange}
        onBlur={formikProps.handleBlur}
        value={formikProps.values.packlist.description}
      />
      <FieldArray name="packlist.categories"
        render={(catArrayHelpers) => (
          <div className={classes.categoryContainer}>
            {formikProps.values.packlist.categories.map((c, i) => (
              <div key={c.internalId}>
                <div>
                  <TextField
                    name={`packlist.categories.${i}.name`}
                    label="Category name"
                    onChange={formikProps.handleChange}
                    onBlur={formikProps.handleBlur}
                    value={c.name}
                  />
                  <IconButton aria-label="delete" onClick={() => catArrayHelpers.remove(i)}>
                    <Delete />
                  </IconButton>
                  <FieldArray name={`packlist.categories.${i}.categoryItems`}
                    render={(itemArrayHelpers) => (
                      <div className={classes.itemContainer}>
                        {formikProps.values.packlist.categories[i].categoryItems.map((ci, j) => {
                          const userItem = formikProps.values.userItems.find(i => i.internalId === ci.userItemId);
                          return (
                            <div key={ci.internalId}>
                              <TextField
                                label="User item name"
                                value={userItem?.name}
                              />
                              <TextField
                                label="User item description"
                                value={userItem?.description}
                              />
                              <TextField
                                type="number"
                                label="Weight"
                                value={userItem?.weight}
                              />
                              <TextField
                                name={`packlist.categories.${i}.categoryItems.${j}.quantity`}
                                type="number"
                                label="Quantity"
                                onChange={formikProps.handleChange}
                                onBlur={formikProps.handleBlur}
                                value={ci.quantity}
                              />
                              <IconButton aria-label="delete" onClick={() => itemArrayHelpers.remove(j)}>
                                <Delete />
                              </IconButton>
                            </div>
                          );
                        })}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => addCategoryItem(itemArrayHelpers)}
                        >Add item</Button>

                      </div>
                    )}
                  />
                </div>
                <p>Total: {formikProps.values.packlist.categories[i].categoryItems.reduce(
                  (acc, val) => {
                    const qty = val.quantity;
                    const weight = formikProps.values.userItems.find(i => i.internalId === val.userItemId)?.weight || 0;
                    const res = qty * weight;
                    return acc + res;
                  }, 0)}</p>
              </div>
            ))}
            <Button
              variant="outlined"
              onClick={() => addCategory(catArrayHelpers)}
            >Add category</Button>
          </div>
        )}
      />
    </Form>
  );
};

export default PacklistForm;