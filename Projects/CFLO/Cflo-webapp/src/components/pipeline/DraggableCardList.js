import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {StatusItem} from './status.item';
import Typography from '@material-ui/core/Typography';
import {ColorBlob} from './color.cards';
import Paper from '@material-ui/core/Paper';
import {AppBar, Box, Toolbar} from '@material-ui/core';
import Column from './card.column';
// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const newList = [...list];
  const [removed] = newList.splice(startIndex, 1);
  newList.splice(endIndex, 0, removed);
  return newList;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return {result, cardId: removed, status: droppableDestination.droppableId};
};


const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  margin: `0px 0px 0px ${grid}px`,

  // change background colour if dragging
  background: isDragging ? '#fafafa' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? '#fafafa' : '#fafafa',
  width: '16.5rem',
  minHeight: '30rem',
});

class DraggableStatusList extends Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    const {stateObject, setStateObject, setStatus} = this.props;
    const {source, destination} = result;
    // console.log(result,' is the result')
    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const sourceState = source.droppableId;
      const cardIds = stateObject[sourceState];

      const items = reorder(
          cardIds,
          source.index,
          destination.index,
      );

      const newObject = {};
      newObject[sourceState] = items;
      setStateObject({
        ...stateObject,
        ...newObject,
      });
    }
    else {
      const sourceState = source.droppableId;
      const sourceCardIds = stateObject[sourceState];

      const destinationState = destination.droppableId;
      const destinationCardIds = stateObject[destinationState];

      const {result, cardId, status} = move(
          sourceCardIds,
          destinationCardIds,
          source,
          destination,
      );

      // console.log(result, sourceState,sourceCardIds, destinationCardIds,destinationState)

      setStateObject({
        ...stateObject,
        ...result,
      });

      setStatus(cardId, status);
    }
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    // console.log(this.props,' is the props')

    const {
      stateObject,
      setStateObject,
      stateColor,
      states,
      getCard,
    } = this.props;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        {states.map((state)=>{
          const color = stateColor[state];
          const cardIds = stateObject[state]&&stateObject[state].length>0?stateObject[state]:[];
          return (
            <Column state={state} color={color} >
              <Droppable droppableId={state}>
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {cardIds.map((cardId, index) => (
                      <Draggable key={cardId} draggableId={cardId} index={index}>
                        {(provided, snapshot) => {
                          const card = getCard(cardId);
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style,
                              )}
                            >
                              {card}
                            </div>
                          );
                        }}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Column>

          );
        })}

      </DragDropContext>
    );
  }
}

export default DraggableStatusList;
