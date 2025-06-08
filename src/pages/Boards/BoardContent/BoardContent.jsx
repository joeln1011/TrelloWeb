import { useCallback, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";

import { mapOrder } from "~/utils/sorts";
import { cloneDeep, isEmpty } from "lodash";
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  defaultDropAnimationSideEffects,
  pointerWithin,
  getFirstCollision,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Column from "./ListColumns/Column/Column";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import { generatePlaceholderCard } from "~/utils/formatter";

const ACTIVE_DRAP_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAP_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAP_ITEM_TYPE_CARD",
};

function BoardContent({ board }) {
  // Sensors are used to handle drag and drop interactions in 10px, fix ficking the distance call an event
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 },
  // });
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500,
      activationDistance: 10,
    },
  });
  const mySensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);
  const [prevColumnWhenDraggingCard, setPrevColumnWhenDraggingCard] =
    useState(null);
  const lastOverId = useRef(null);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  //Find Column by CardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id)?.includes(cardId)
    );
  };

  // Update state when move card between different columns
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns((prevColumns) => {
      //find the index of the active column
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );
      let newCardIndex;
      const isBeLowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;

      const modifier = isBeLowOverItem ? 1 : 0;
      newCardIndex =
        overCardIndex >= 0
          ? newCardIndex + modifier
          : overColumn?.cards?.length + 1;
      const nextColumns = cloneDeep(prevColumns);

      const nextActiveColumn = nextColumns.find(
        (col) => col._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (col) => col._id === overColumn._id
      );

      // Remove the card from the active column
      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );
        // Update the card order IDs in the active column
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }

      // Add plaveholder card if the active column is empty after removing the card
      if (isEmpty(nextActiveColumn.cards)) {
        nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
      }

      if (nextOverColumn) {
        // Check card existence before adding
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );

        // Update columnId in card data when move between columns
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        };

        // Adding the card to the over column at the new index
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        );

        // Remove placeholder card if exists
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_PlaceholderCard
        );

        // Update the card order IDs in the over column
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }

      return nextColumns;
    });
  };

  // This function is called when the drag operation starts
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAP_ITEM_TYPE.CARD
        : ACTIVE_DRAP_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);
    // When drag card, set the previous column
    if (event?.active?.data?.current?.columnId) {
      const col = findColumnByCardId(event?.active?.id);
      setPrevColumnWhenDraggingCard(col);
    }
  };

  //Triggered when the item is dragged over another item
  const handleDragOver = (event) => {
    // Return if the active drag item is a column
    if (activeDragItemType === ACTIVE_DRAP_ITEM_TYPE.COLUMN) return;
    const { active, over } = event;

    if (!active || !over) return;

    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    const { id: overCardId } = over;

    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    // Trigger when dragging a card over a different column,if same column do nothing
    if (!activeColumn || !overColumn) return;

    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      );
    }
  };

  // This function is called when the drag operation ends
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) return;

    // Active if drag and drop a card
    if (activeDragItemType === ACTIVE_DRAP_ITEM_TYPE.CARD) {
      const {
        id: activeDraggingCardId,
        data: { current: activeDraggingCardData },
      } = active;
      const { id: overCardId } = over;

      const activeColumn = findColumnByCardId(activeDraggingCardId);
      const overColumn = findColumnByCardId(overCardId);

      // Trigger when dragging a card over a different column,if same column do nothing
      if (!activeColumn || !overColumn) return;

      if (prevColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        );
      } else {
        // Get an old postion from prevColumnWhenDraggingCard
        const oldCardIndex = prevColumnWhenDraggingCard?.card?.findIndex(
          (col) => col._id === activeDragItemId
        );
        // Get a new position from overColumn
        const newCardIndex = overColumn?.cards?.findIndex(
          (col) => col._id === overCardId
        );
        const dndOrderedCards = arrayMove(
          prevColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );
        setOrderedColumns((prevColumns) => {
          // Clone previous columns to avoid direct state mutation
          const nextColumns = cloneDeep(prevColumns);

          //Find the column to update
          const targetColumn = nextColumns.find(
            (col) => col._id === overColumn._id
          );

          // Update the column with the reordered cards
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);
          // Return the updated columns
          return nextColumns;
        });
      }
    }

    if (
      activeDragItemType === ACTIVE_DRAP_ITEM_TYPE.COLUMNM &&
      active.id !== over.id
    ) {
      // If same index it wont be changed
      const oldColumnIndex = orderedColumns.findIndex(
        (col) => col._id === active.id
      );
      // New index is where the item was dropped
      const newColumnIndex = orderedColumns.findIndex(
        (col) => col._id === over.id
      );

      const dndOrderedColumns = arrayMove(
        orderedColumns,
        oldColumnIndex,
        newColumnIndex
      );
      setOrderedColumns(dndOrderedColumns);
    }

    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setActiveDragItemData(null);
    setPrevColumnWhenDraggingCard(null);
  };

  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: 0.5 } },
    }),
  };

  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAP_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }
      // Find all the pointers within the container
      const pointerIntersections = pointerWithin(args);

      // If there are no pointer intersections at all, return empty array
      if (!pointerIntersections?.length) return;

      // Find the first overId of pointerIntersections
      let overId = getFirstCollision(pointerIntersections, "id");
      if (overId) {
        const checkColumn = orderedColumns.find((col) => col._id === overId);
        if (checkColumn) {
          overId = closestCorners({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => {
                return (
                  container.id !== overId &&
                  checkColumn?.cardOrderIds?.includes(container.id)
                );
              }
            ),
          })[0]?.id;
        }
        // Check if the overId is the id of a column
        lastOverId.current = overId;
        return [{ id: overId }];
      }
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },

    [activeDragItemType]
  );

  return (
    <DndContext
      sensors={mySensors}
      //customize collisionDetection to prevent drop card into empty column
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAP_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAP_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}

export default BoardContent;
