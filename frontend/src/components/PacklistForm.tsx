import React, { useRef } from "react";
import { Button, makeStyles } from "@material-ui/core";
import { AddCircle } from "@material-ui/icons";
import { FastField, FieldArray, FieldArrayRenderProps, Form, useFormikContext } from "formik";
import { nanoid } from "nanoid";
import { DragDropContext, DraggableLocation, Droppable, DropResult } from "react-beautiful-dnd";

import { Category } from "../types";
import PacklistFormCategory from "./PacklistFormCategory";
import { UpdateStateInput } from "./LoggedIn";
import FormTextField from "./FormTextField";

/*
  Currently the total structure of the Form is fairly deeply nested since we 
  are using Formik, Material UI and react-beautiful-dnd which all add to the 
  depth with their components.
*/

const useStyles = makeStyles((theme) => ({
  formContainer: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    border: "1px solid black",
  },
}));

interface Props {
  packlistIndex: number;
  // packlistId: string;
  // setPacklistId: React.Dispatch<React.SetStateAction<string>>;
}


const PacklistForm = ({ packlistIndex }: Props) => {
  const formikContext = useFormikContext<UpdateStateInput>();

  const addCategory = (helpers: FieldArrayRenderProps) => {
    const newCategory: Category = { internalId: nanoid(), name: "", categoryItems: [] };
    helpers.push(newCategory);
  };

  const classes = useStyles();

  const categoryHelpersRef = useRef<FieldArrayRenderProps>();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // if (!destination || !formikContext.values.packlist) {
    //   return;
    // }
    if (!destination || !formikContext.values.packlists[packlistIndex]) {
      return;
    }

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      // No movement
      return;
    }

    if (result.type === "droppableCategory") {
      // Move entire category including CategoryItems
      categoryHelpersRef.current!.move(source.index, destination.index);
      return;
    }
    if (result.type === "droppableItem") {
      if (source.droppableId === destination.droppableId) {
        // Move item within same category
        const categoryIndex = parseInt(source.droppableId.split("-")[1]);
        const categoryItems = formikContext.values.packlists[packlistIndex].categories[categoryIndex].categoryItems;

        const modifiedItems = Array.from(categoryItems);

        const [movedItem] = modifiedItems.splice(source.index, 1);
        modifiedItems.splice(destination.index, 0, movedItem);

        formikContext.setFieldValue(`packlists.${packlistIndex}.categories.${categoryIndex}.categoryItems`, modifiedItems);
      } else {
        moveItemBetweenCategories(source, destination);
      }
    }
  };

  const moveItemBetweenCategories = (source: DraggableLocation, destination: DraggableLocation) => {
    if (!destination || !formikContext.values.packlists[packlistIndex]) {
      return;
    }
    const sourceCategoryIndex = parseInt(source.droppableId.split("-")[1]);
    const destinationCategoryIndex = parseInt(destination.droppableId.split("-")[1]);
    const categories = formikContext.values.packlists[packlistIndex].categories;

    const sourceCategoryItems = categories[sourceCategoryIndex].categoryItems;
    const destinationCategoryItems = categories[destinationCategoryIndex].categoryItems;

    const newSourceItems = Array.from(sourceCategoryItems);
    const newDestinationItems = Array.from(destinationCategoryItems);

    const [movedItem] = newSourceItems.splice(source.index, 1);
    newDestinationItems.splice(destination.index, 0, movedItem);

    formikContext.setFieldValue(`packlists.${packlistIndex}.categories.${sourceCategoryIndex}.categoryItems`, newSourceItems);
    formikContext.setFieldValue(`packlists.${packlistIndex}.categories.${destinationCategoryIndex}.categoryItems`, newDestinationItems);
  };


  // if (!formikContext.values.packlist) {
  //   return null;
  // }

  if (packlistIndex === undefined || packlistIndex < 0) {
    return null;
  }

  return (
    <Form className={classes.formContainer}>
      <FastField
        name={`packlists.${packlistIndex}.name`}
        label="Name"
        component={FormTextField}
      // onChange={formikContext.handleChange}
      // onBlur={formikContext.handleBlur}
      // value={formikContext.values.packlists[packlistIndex].name}
      />
      <FastField
        name={`packlists.${packlistIndex}.description`}
        label="Description"
        component={FormTextField}

      // onChange={formikContext.handleChange}
      // onBlur={formikContext.handleBlur}
      // value={formikContext.values.packlists[packlistIndex].description}
      />
      <DragDropContext onDragEnd={handleDragEnd}>
        <FieldArray name={`packlists.${packlistIndex}.categories`}
          render={(arrayHelpers) => {
            categoryHelpersRef.current = arrayHelpers;
            return (
              <div>
                <Droppable droppableId="categoryMain" type="droppableCategory">
                  {provided => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {formikContext.values.packlists[packlistIndex].categories.map((category, i) => (
                        <PacklistFormCategory
                          key={category.internalId}
                          packlistIndex={packlistIndex}
                          category={category}
                          categoryIndex={i}
                          categoryArrayHelpers={arrayHelpers}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => addCategory(arrayHelpers)}
                  startIcon={<AddCircle />}
                >Add category</Button>
              </div>
            );
          }}
        />
      </DragDropContext>
    </Form>
  );
};

export default PacklistForm;