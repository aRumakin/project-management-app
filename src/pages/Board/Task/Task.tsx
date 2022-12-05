import { Draggable } from 'react-beautiful-dnd';

import { useState } from 'react';

import {  ITask } from '@/app/types';
import Confirmation from '@/components/Confirmation/Confirmation';

import './Task.pcss';

interface TaskProps {
  task: ITask;
  onDelete: (task: ITask)=> void;
  onEdit: (task: ITask)=> void;
  index: number;
}
export const Task = ({ task, onDelete, onEdit, index }: TaskProps): JSX.Element => {
/*  delete confirmation  */
  const [showConfirmation, setShowConfirmation ] = useState(false);
  const onClickDeleteHandle = () => {
    setShowConfirmation(true);
  };

  return (
    <>
      {(showConfirmation) && <Confirmation componentName="TASK" deleteFunc={() => onDelete(task)} hideConfirmFunc={setShowConfirmation}/>}

      <Draggable draggableId={task.id} index={index}>
        {providedCol => (
          <div className="task-wrapper"
            {...providedCol.draggableProps}
            {...providedCol.dragHandleProps}
            ref={providedCol.innerRef}>
            <div className="task-inner">
              <div
                className="task-content"
                onClick={() => onEdit(task)}
                role="button"
                tabIndex={0}
                onKeyUp={e => {
                  if (e.code === 'Enter' || e.code === 'Space') {
                    onEdit(task);
                  }
                }}
              >
                {task.title}
              </div>
              <div className="task-buttons">
                <button
                  type='button'
                  className="task-bttn"
                  onClick={onClickDeleteHandle}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="task-button-icon">
                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
};
