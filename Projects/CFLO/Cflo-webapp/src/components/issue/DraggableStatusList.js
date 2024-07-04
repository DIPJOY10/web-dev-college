import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {StatusItem} from './status.item';

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const newList = [...list];
  const [removed] = newList.splice(startIndex, 1);
  newList.splice(endIndex, 0, removed);
  return newList;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  margin: `${grid}px ${grid}px ${grid}px ${grid}px`,

  // change background colour if dragging
  background: isDragging ? '#fafafa' : 'white',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? '#fafafa' : '#fafafa',
  width: '18rem',
});

class DraggableStatusList extends Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
        this.props.states,
        result.source.index,
        result.destination.index,
    );

    // console.log(items,' are the items')

    this.props.setStates(items);
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    // console.log(this.props,' is the props')

    const {
      states,
      stateColor,
    } = this.props;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {states.map((state, index) => (
                <Draggable key={state} draggableId={state} index={index}>
                  {(provided, snapshot) => {
                    const color = stateColor[state];
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
                        <StatusItem text={state} color={color}/>
                      </div>
                    );
                  }}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}

export default DraggableStatusList;
