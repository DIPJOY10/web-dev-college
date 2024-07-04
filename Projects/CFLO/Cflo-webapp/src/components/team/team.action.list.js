import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {Network, Task, Payment, Issue, Discussion, Doc} from './cards/index';
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
  flex: 1,
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  width: '100%',

});

class TeamActionList extends Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.state = {
      actions: ['Network', 'Task', 'Payment', 'Issue', 'Discussion', 'Doc'],
    };
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const actions = reorder(
        this.state.actions,
        result.source.index,
        result.destination.index,
    );

    // console.log(actions,' are the actions')

    this.setState({actions});
  }

  // Normally you would want to split things out into separate components.
  // But in this example everything is just done in one place for simplicity
  render() {
    // console.log(this.props,' is the props')

    const {
      teamId,
    } = this.props;

    const actions = ['Network', 'Task', 'Payment', 'Issue', 'Discussion', 'Doc'];
    const dictionary = {
      Network, Task, Payment, Issue, Discussion, Doc,
    };

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {actions.map((action, index) => (
                <Draggable key={action} draggableId={action} index={index}>
                  {(provided, snapshot) => {
                    const Card = dictionary[action];
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
                        <Card teamId={teamId} />
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

export default TeamActionList;
