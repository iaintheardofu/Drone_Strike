import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';

const DragDropTaskBoard = () => {
  // so the initial task data is now organized by columns
  const [columns, setColumns] = useState({
    todo: {
      id: 'todo',
      title: 'To Do',
      icon: <Clock size={18} className="column-icon" />,
      taskIds: ['task-1', 'task-4', 'task-5'],
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      icon: <AlertCircle size={18} className="column-icon" />,
      taskIds: ['task-2'],
    },
    completed: {
      id: 'completed',
      title: 'Completed',
      icon: <CheckCircle size={18} className="column-icon" />,
      taskIds: ['task-3'],
    },
  });

  //All tasks data
  const [tasks, setTasks] = useState({
    'task-1': {
      id: 'task-1',
      text: 'Review property details for Jorge Almaguer',
      assignee: 'You',
      priority: 'High',
      dueDate: 'Today',
      relatedTo: 'Jorge Almaguer',
    },
    'task-2': {
      id: 'task-2',
      text: 'Send tax information to Mike Johnson',
      assignee: 'You',
      priority: 'Medium',
      dueDate: 'Tomorrow',
      relatedTo: 'Mike Johnson',
    },
    'task-3': {
      id: 'task-3',
      text: 'Initial contact with Sarah Williams',
      assignee: 'Sarah',
      priority: 'Low',
      dueDate: 'Completed',
      relatedTo: 'Sarah Williams',
    },
    'task-4': {
      id: 'task-4',
      text: 'Prepare offer for 123 Main St property',
      assignee: 'You',
      priority: 'Critical',
      dueDate: 'Mar 20, 2025',
      relatedTo: 'Jorge Almaguer',
    },
    'task-5': {
      id: 'task-5',
      text: 'Schedule property inspection',
      assignee: 'Mike',
      priority: 'Medium',
      dueDate: 'Mar 25, 2025',
      relatedTo: 'Property Inspection',
    },
  });

  //column order
  const [columnOrder, setColumnOrder] = useState(['todo', 'inProgress', 'completed']);

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back to its original position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    // Handle column reordering (if dragging columns)
    if (result.type === 'column') {
      const newColumnOrder = Array.from(columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      setColumnOrder(newColumnOrder);
      return;
    }

    // Source & destination columns
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    // If moving within the same column
    if (sourceColumn === destColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      setColumns({
        ...columns,
        [newColumn.id]: newColumn,
      });
      return;
    }

    // moving from one column to another
    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    sourceTaskIds.splice(source.index, 1);
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    };

    const destTaskIds = Array.from(destColumn.taskIds);
    destTaskIds.splice(destination.index, 0, draggableId);
    const newDestColumn = {
      ...destColumn,
      taskIds: destTaskIds,
    };

    // Update state with new column data
    setColumns({
      ...columns,
      [newSourceColumn.id]: newSourceColumn,
      [newDestColumn.id]: newDestColumn,
    });
  };

  const getPriorityClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'priority-critical';
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const addNewTask = () => {
    // Generate a unique ID for the new task
    const newTaskId = `task-${Object.keys(tasks).length + 1}`;
    
    // Create a new task
    const newTask = {
      id: newTaskId,
      text: 'New task - click to edit',
      assignee: 'You',
      priority: 'Medium',
      dueDate: 'Not set',
      relatedTo: 'Not assigned',
    };
    
    // update tasks state
    setTasks({
      ...tasks,
      [newTaskId]: newTask,
    });
    
    //add the new task to the "to do" column
    const newTodoColumn = {
      ...columns.todo,
      taskIds: [...columns.todo.taskIds, newTaskId],
    };
    
    //update columns state
    setColumns({
      ...columns,
      todo: newTodoColumn,
    });
  };

  return (
    <div className="task-board-container">
      <div className="task-board-header">
        <h3 className="panel-title">Task Management</h3>
        <button className="btn-primary" onClick={addNewTask}>
          <Plus size={16} className="icon" />
          New Task
        </button>
      </div>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="task-board-columns">
          {columnOrder.map((columnId, index) => {
            const column = columns[columnId];
            const columnTasks = column.taskIds.map(taskId => tasks[taskId]);
            
            return (
              <div className="task-column" key={column.id}>
                <div className="column-header">
                  {column.icon}
                  <h4 className="column-title">{column.title}</h4>
                  <span className="task-count">{columnTasks.length}</span>
                </div>
                
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <div className="task-card-content">
                                <p className="task-text">{task.text}</p>
                                <div className="task-meta">
                                  <span className={`task-priority ${getPriorityClass(task.priority)}`}>
                                    {task.priority}
                                  </span>
                                  <span className="task-assignee">{task.assignee}</span>
                                  <span className="task-due-date">{task.dueDate}</span>
                                </div>
                                <div className="task-related">
                                  <small>Related to: {task.relatedTo}</small>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};

export default DragDropTaskBoard;