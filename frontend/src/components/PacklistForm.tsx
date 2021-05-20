import { useRef } from "react";
import { Button, TextField, makeStyles } from "@material-ui/core";
import { FieldArray, FieldArrayRenderProps, Form, FormikProps } from "formik";
import { nanoid } from "nanoid";
import { DragDropContext, DraggableLocation, Droppable, DropResult } from "react-beautiful-dnd";

import { Category, CategoryItem, Packlist, UserItem } from "../types";
import PacklistFormCategory from "./PacklistFormCategory";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: "white",
    border: "1px solid black",
  },
}));

interface PacklistFormProps {
  formikProps: FormikProps<{
    userItems: UserItem[];
    packlist: Packlist;
  }>;
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
    // New UserItem needs to pushed through formikProps
    const userItems = formikProps.values.userItems.concat(newUserItem);
    formikProps.setFieldValue("userItems", userItems);
  };

  const classes = useStyles();

  const categoryHelpersRef = useRef<FieldArrayRenderProps>();
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) {
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
        const sourceCategoryIndex = parseInt(source.droppableId.split("-")[1]);
        const categoryItems = formikProps.values.packlist.categories[sourceCategoryIndex].categoryItems;

        // Deep copy CategoryItems
        const items = JSON.parse(JSON.stringify(categoryItems));
        [items[source.index], items[destination.index]] = [items[destination.index], items[source.index]];
        formikProps.setFieldValue(`packlist.categories.${sourceCategoryIndex}.categoryItems`, items);
      } else {
        // Move item to another category
        moveItemBetweenCategories(source, destination);
      }
    }
  };

  const moveItemBetweenCategories = (source: DraggableLocation, destination: DraggableLocation) => {
    const sourceCategoryIndex = parseInt(source.droppableId.split("-")[1]);
    const destinationCategoryIndex = parseInt(destination.droppableId.split("-")[1]);
    const categories = formikProps.values.packlist.categories;

    const sourceCategoryItems = categories[sourceCategoryIndex].categoryItems;
    const destinationCategoryItems = categories[destinationCategoryIndex].categoryItems;

    // Deep copy CategoryItems
    const newSourceItems: CategoryItem[] = JSON.parse(JSON.stringify(sourceCategoryItems));
    const newDestinationItems: CategoryItem[] = JSON.parse(JSON.stringify(destinationCategoryItems));

    const [movedItem] = newSourceItems.splice(source.index, 1);
    newDestinationItems.splice(destination.index, 0, movedItem);

    formikProps.setFieldValue(`packlist.categories.${sourceCategoryIndex}.categoryItems`, newSourceItems);
    formikProps.setFieldValue(`packlist.categories.${destinationCategoryIndex}.categoryItems`, newDestinationItems);
  };

  return (
    <Form className={classes.formContainer}>
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
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="categoryMain" type="droppableCategory">
          {provided => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <FieldArray name="packlist.categories"
                render={(arrayHelpers) => {
                  categoryHelpersRef.current = arrayHelpers;
                  return (
                    <div>
                      {formikProps.values.packlist.categories.map((category, i) => (
                        <PacklistFormCategory
                          key={category.internalId}
                          category={category}
                          categoryIndex={i}
                          categoryArrayHelpers={arrayHelpers}
                          addCategoryItem={addCategoryItem}
                        />
                      ))}
                      <Button
                        variant="outlined"
                        onClick={() => addCategory(arrayHelpers)}
                      >Add category</Button>
                    </div>
                  );
                }}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Form>
  );
};

export default PacklistForm;