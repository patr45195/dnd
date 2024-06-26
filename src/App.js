import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./App.css";
import { generateRandomShoppingListName } from "./utils/generateRandomListName";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const DATA = [
  {
    id: "list1",
    name: "Бутерброд",
    items: [
      { id: "item1", name: "3% Молоко" },
      { id: "item2", name: "Хлеб" },
    ],
  },
  {
    id: "list2",
    name: "Салат",
    items: [
      {
        id: "item3",
        name: "Помидоры",
      },
      { id: "item4", name: "Огурцы" },
    ],
  },
  {
    id: "list3",
    name: "Хлеб",
    items: [
      { id: "item5", name: "Мука" },
      { id: "item6", name: "Вода" },
    ],
  },
];

const MOCK_DATA = [
  { id: "item7", name: "Сыр" },
  { id: "item8", name: "Колбаса" },
  { id: "item9", name: "Соль" },
  { id: "item10", name: "Сахар" },
  { id: "item11", name: "Лимон" },
];

function App() {
  const [stores, setStores] = useState(DATA);
  const [mockData, setMockData] = useState(MOCK_DATA);

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
            <h1>Рецепты</h1>
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
      <AddIcon onClick={addList} />
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
            <DeleteIcon onClick={() => removeList(id)} />
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
