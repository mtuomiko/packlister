import React from "react";
import { Box, Grid, IconButton, makeStyles } from "@material-ui/core";
import { Delete, Reorder } from "@material-ui/icons";
import { FastField, FieldArrayRenderProps, useFormikContext } from "formik";
import { Draggable } from "react-beautiful-dnd";
import { CategoryItem } from "../types";
import FormTextField from "./FormTextField";
import { UpdateStateInput } from "./LoggedIn";

const useStyles = makeStyles((theme) => ({
  itemContainer: {
    backgroundColor: theme.palette.background.default,
  },
  handleBox: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

interface Props {
  packlistIndex: number;
  item: CategoryItem;
  categoryIndex: number;
  itemIndex: number;
  itemArrayHelpers: FieldArrayRenderProps;
}

const PacklistFormItem = ({ packlistIndex, item, categoryIndex, itemIndex, itemArrayHelpers }: Props) => {
  const formikContext = useFormikContext<UpdateStateInput>();

  // Find which UserItem this item refers to
  const userItemIndex = formikContext.values.userItems.findIndex(i => i.internalId === item.userItemId);

  const classes = useStyles();

  return (
    <Draggable key={item.internalId} draggableId={item.internalId} index={itemIndex}>
      {provided => (
        <div
          className={classes.itemContainer}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <Grid container spacing={0}>
            <Grid item xs={1}>
              <Box className={classes.handleBox}>
                <IconButton {...provided.dragHandleProps} size="small"><Reorder /></IconButton>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box paddingLeft={1}>
                <FastField
                  name={`userItems.${userItemIndex}.name`}
                  size="small"
                  component={FormTextField}
                  placeholder="Name"
                  fullWidth
                />
              </Box>
            </Grid>
            <Grid item xs={4}>
              <FastField
                name={`userItems.${userItemIndex}.description`}
                size="small"
                component={FormTextField}
                placeholder="Description"
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <FastField
                name={`userItems.${userItemIndex}.weight`}
                size="small"
                component={FormTextField}
                type="number"
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <FastField
                size="small"
                component={FormTextField}
                name={`packlists.${packlistIndex}.categories.${categoryIndex}.categoryItems.${itemIndex}.quantity`}
                type="number"
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton
                aria-label="delete" onClick={() => itemArrayHelpers.remove(itemIndex)}
                size="small">
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        </div>
      )}
    </Draggable>
  );
};

export default PacklistFormItem;