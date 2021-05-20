import React from "react";
import { Box, Button, Grid, IconButton, makeStyles, TextField, Typography } from "@material-ui/core";
import { AddCircle, Delete, Reorder } from "@material-ui/icons";
import { FieldArray, FieldArrayRenderProps, useFormikContext } from "formik";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Category, CategoryItem, UserItem } from "../types";
import PacklistFormItem from "./PacklistFormItem";
import { nanoid } from "nanoid";
import { UpdateStateInput } from "./LoggedIn";

const useStyles = makeStyles((theme) => ({
  categoryContainer: {
    backgroundColor: theme.palette.background.default,
    marginBottom: theme.spacing(2),
  },
  handleBox: {
    display: "flex",
    justifyContent: "flex-end",
  },
  categoryNameInput: {
    fontWeight: "bold",
  },
}));

interface Props {
  category: Category;
  categoryIndex: number;
  categoryArrayHelpers: FieldArrayRenderProps;
}

const PacklistFormCategory = ({ category, categoryIndex, categoryArrayHelpers }: Props) => {
  const formikContext = useFormikContext<UpdateStateInput>();

  const addCategoryItem = (helpers: FieldArrayRenderProps) => {
    const newCategoryItem: CategoryItem = { internalId: nanoid(), userItemId: nanoid(), quantity: 0 };
    // Adding a new item so the corresponding UserItem needs to created
    const newUserItem: UserItem = {
      internalId: newCategoryItem.userItemId,
      name: "",
      description: "",
      weight: 0,
      __typename: "UserItem",
    };
    helpers.push(newCategoryItem);
    // New UserItem needs to pushed through setFieldValue since we don't have
    // access to helpers of the UserItem arrays
    const userItems = formikContext.values.userItems.concat(newUserItem);
    formikContext.setFieldValue("userItems", userItems);
  };

  const classes = useStyles();

  return (
    <Draggable draggableId={category.internalId} index={categoryIndex}>
      {provided => (
        <div
          className={classes.categoryContainer}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Grid container spacing={0}>
            <Grid item xs={1}>
              <Box className={classes.handleBox}>
                <IconButton {...provided.dragHandleProps} size="small"><Reorder /></IconButton>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <TextField
                name={`packlist.categories.${categoryIndex}.name`}
                placeholder="Category name"
                onChange={formikContext.handleChange}
                onBlur={formikContext.handleBlur}
                value={category.name}
                fullWidth
                InputProps={{ classes: { root: classes.categoryNameInput } }}
              />
            </Grid>
            <Grid item xs={1}>
              <Typography>Weight (g)</Typography>
            </Grid>
            <Grid item xs={1}>
              <Typography>Quantity</Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                aria-label="delete" onClick={() => categoryArrayHelpers.remove(categoryIndex)}
                size="small"
              >
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
          <FieldArray name={`packlist.categories.${categoryIndex}.categoryItems`}
            render={(itemArrayHelpers) => (
              <div>
                <Droppable droppableId={`itemDroppable-${categoryIndex}`} type="droppableItem">
                  {itemDropProvided => (
                    <div
                      ref={itemDropProvided.innerRef}
                      {...itemDropProvided.droppableProps}
                    >
                      {formikContext.values.packlist.categories[categoryIndex].categoryItems.map((item, itemIndex) => (
                        <PacklistFormItem
                          key={item.internalId}
                          item={item}
                          categoryIndex={categoryIndex}
                          itemIndex={itemIndex}
                          itemArrayHelpers={itemArrayHelpers}
                        />
                      ))}
                      {itemDropProvided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Grid container>
                  <Grid item xs={1}></Grid>
                  <Grid item xs={9}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => addCategoryItem(itemArrayHelpers)}
                      startIcon={<AddCircle />}
                    >Add item</Button>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography className={classes.categoryNameInput}>
                      {formikContext.values.packlist.categories[categoryIndex].categoryItems.reduce(
                        (acc, val) => {
                          const qty = val.quantity;
                          const weight = formikContext.values.userItems.find(i => i.internalId === val.userItemId)?.weight || 0;
                          const res = qty * weight;
                          return acc + res;
                        }, 0)} g
                      </Typography>
                  </Grid>
                  <Grid item xs={1}></Grid>
                </Grid>
              </div>
            )}
          />
        </div>
      )}
    </Draggable>
  );
};

export default PacklistFormCategory;