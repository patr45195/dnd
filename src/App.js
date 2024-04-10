import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./App.css";
import { generateRandomShoppingListName } from "./utils/generateRandomListName";

const DATA = [
  {
    id: "list1",
    name: "Walmart",
    items: [
      { id: "item1", name: "3% Milk" },
      { id: "item2", name: "Butter" },
    ],
  },
  {
    id: "list2",
    name: "Indigo",
    items: [
      {
        id: "item3",
        name: "Designing Data Intensive Applications",
      },
      { id: "item4", name: "Atomic Habits" },
    ],
  },
  {
    id: "list3",
    name: "Lowes",
    items: [
      { id: "item5", name: "Workbench" },
      { id: "item6", name: "Hammer" },
    ],
  },
];

function App() {
  const [stores, setStores] = useState(DATA);

  const addList = () => {
    setStores((prevState) => [
      ...prevState,
      {
        id: String(Math.random()),
        name: generateRandomShoppingListName(),
        items: [],
      },
    ]);
  };

  const removeList = (id) => {
    setStores((prevState) => prevState.filter((store) => store.id !== id));
  };

  const handleDragAndDrop = (results) => {
    console.log(results);
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const reorderedStores = [...stores];

      const storeSourceIndex = source.index;
      const storeDestinatonIndex = destination.index;

      const [removedStore] = reorderedStores.splice(storeSourceIndex, 1);
      reorderedStores.splice(storeDestinatonIndex, 0, removedStore);

      return setStores(reorderedStores);
    }
    const itemSourceIndex = source.index;
    const itemDestinationIndex = destination.index;

    const storeSourceIndex = stores.findIndex(
      (store) => store.id === source.droppableId
    );
    const storeDestinationIndex = stores.findIndex(
      (store) => store.id === destination.droppableId
    );

    const newSourceItems = [...stores[storeSourceIndex].items];
    const newDestinationItems =
      source.droppableId !== destination.droppableId
        ? [...stores[storeDestinationIndex].items]
        : newSourceItems;

    const [deletedItem] = newSourceItems.splice(itemSourceIndex, 1);
    newDestinationItems.splice(itemDestinationIndex, 0, deletedItem);

    const newStores = [...stores];

    newStores[storeSourceIndex] = {
      ...stores[storeSourceIndex],
      items: newSourceItems,
    };
    newStores[storeDestinationIndex] = {
      ...stores[storeDestinationIndex],
      items: newDestinationItems,
    };

    setStores(newStores);
  };

  return (
    <div className="layout__wrapper">
      <div className="card">
        <DragDropContext onDragEnd={handleDragAndDrop}>
          <div>
            <h1>Shopping List</h1>
          </div>
          <Droppable droppableId="ROOT" type="group">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {stores.map((store, index) => (
                  <Draggable
                    draggableId={store.id}
                    index={index}
                    key={store.id}
                  >
                    {(provided) => (
                      <div
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                        ref={provided.innerRef}
                      >
                        <StoreList {...store} removeList={removeList} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <button onClick={addList}>Add List</button>
    </div>
  );
}

function StoreList({ name, items, id, removeList }) {
  return (
    <Droppable droppableId={id}>
      {(provided) => (
        <div
          className="store-wrapper"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <div className="store-container">
            <h3>{name}</h3>
            <button onClick={() => removeList(id)}>delete</button>
          </div>
          <div className="items-container">
            {items.map((item, index) => (
              <Draggable draggableId={item.id} index={index} key={item.id}>
                {(provided) => (
                  <div
                    className="item-container"
                    {...provided.dragHandleProps}
                    {...provided.draggableProps}
                    ref={provided.innerRef}
                  >
                    <h4>{item.name}</h4>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
}

export default App;
