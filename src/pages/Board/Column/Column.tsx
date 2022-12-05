import { useNavigate } from '@tanstack/react-location';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import EasyEdit from 'react-easy-edit';
import { useTranslation } from 'react-i18next';

import { useEffect, useState } from 'react';

import { Task } from '../Task/Task';

import { columnsApi } from '@/api/services/ColumnsService';
import { tasksApi } from '@/api/services/TasksService';
import { IColumn, ITask } from '@/app/types';
import Confirmation from '@/components/Confirmation/Confirmation';
import { Loader } from '@/components/Loader/Loader';
import './Column.pcss';
import { ModalData, ModalForm } from '@/components/ModalForm/ModalForm';
import { useAppSelector } from '@/hooks/redux';
import { getBiggestOrder } from '@/utils/utils';

interface ColumnProps {
  column: IColumn;
  boardId: string;
  onDelete: (col: IColumn) => void;
  index: number;
  activeTask: string | null;
}

export const Column = ({
  boardId, column, onDelete, index, activeTask,
}: ColumnProps): JSX.Element => {
  const [showModalCreateTask, setShowModalCreateTask] = useState(false);
  const [showModalEditTask, setShowModalEditTask] = useState(false);
  const [editedTask, setEditedTask] = useState<ITask | null>(null);

  const { data: tasks, isLoading } =
    tasksApi.useGetTasksQuery({ boardId, colId: column.id });

  const navigate = useNavigate();

  const { user } = useAppSelector(
    state => state.authReducer,
  );

  const [createTask, { isLoading: crLoading }] = tasksApi.useCreateTaskMutation();
  const [deleteTask, { isLoading: delLoading }] = tasksApi.useDeleteTaskMutation();
  const [updateTask, { isLoading: editLoading }] = tasksApi.useUpdateTaskMutation();

  const { t } = useTranslation();

  const handleDeleteTask = async (task: ITask) => {
    await deleteTask({ task, boardId, colId: column.id });
  };

  const handleCreateTask =  () => {
    setShowModalCreateTask(true);
  };

  const handleEditTask = (task: ITask) => {
    setShowModalEditTask(true);
    setEditedTask(task);
  };

  const closeModal = () =>{
    setShowModalEditTask(false);
    setShowModalCreateTask(false);

    if(activeTask){
      navigate({ to: `/boards/${boardId}`, replace:true });
    }
  };

  const createNewTask = async (data: ModalData) => {
    closeModal();

    await createTask({
      colId: column.id,
      boardId,
      task: {
        title: data.title,
        order: getBiggestOrder(tasks) + 1,
        description: data.description || '',
        userId: user!.id,
        users: [''],
      },
    });
  };

  const editTask = async (data: ModalData) => {
    if(editedTask ){
      await updateTask( {
        colId: column.id,
        boardId,
        taskId: editedTask.id,
        task: {
          title: data.title,
          description: data.description || '',
          order: editedTask.order,
          columnId: editedTask.columnId,
          userId: editedTask.userId,
          users: editedTask.users,
        },
      });
    }

    setEditedTask(null);

    closeModal();
  };

  /*  editable title  */
  const [updateColTitle, { isLoading: editTitleLoading }] = columnsApi.useUpdateColumnMutation();
  const [columnTitle, setColumnTitle] = useState(column.title);

  const handleUpdateColTitle = async (col: IColumn, colId: string, newTitle: string) => {
    setColumnTitle(newTitle);
    await updateColTitle({
      colId,
      boardId,
      col: {
        title: newTitle,
        order: col.order,
      },
    });
  };

  const saveButtonLabel = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="green" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
  const cancelButtonLabel = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#C2412B" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  /*  delete confirmation  */
  const [showConfirmation, setShowConfirmation ] = useState(false);
  const onClickDeleteHandle = () => {
    setShowConfirmation(true);
  };

  useEffect(() => {
    if(activeTask) {
      const task = tasks?.find(el=>el.id === activeTask);
      if (task) {
        setShowModalEditTask(true);
        setEditedTask(task);
      }
    }
  }, [activeTask, tasks]);

  return (
    <Draggable draggableId={column.id} index={index}>
      {provided => (
        <section className="column-wrapper"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}>

          {((isLoading || crLoading || delLoading || editLoading || editTitleLoading) && <Loader />)}

          {((showModalCreateTask) &&
            <ModalForm
              type='CREATE_TASK'
              modalSubmit={createNewTask}
              modalAbort={closeModal}
            />)}

          {((showModalEditTask) &&
            <ModalForm
              type='EDIT_TASK'
              modalSubmit={editTask}
              modalAbort={closeModal}
              initialData={{ title: editedTask?.title || '', description: editedTask?.description }}
            />)}

          {(showConfirmation) && <Confirmation componentName="COLUMN" deleteFunc={() => onDelete(column)} hideConfirmFunc={setShowConfirmation} />}

          <div className="column">

            <EasyEdit
              cssClassPrefix="easy-edit-column-title "
              type="text"
              onSave={(value: string) => handleUpdateColTitle(column, column.id, value)}
              saveButtonLabel={saveButtonLabel}
              cancelButtonLabel={cancelButtonLabel}
              value={columnTitle}
              cancelOnBlur
              attributes={{ name: column.title, id: column.id, value: column.title }}
            />

            <button
              type='button'
              className="column-del"
              onClick={onClickDeleteHandle}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="board-del-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>

            <Droppable droppableId={column.id} type="tasks">
              {providedCol => (
                <div className="column-body"
                  {...providedCol.droppableProps}
                  ref={providedCol.innerRef} >
                  {tasks && [...tasks].sort((a, b) => (a.order - b.order)).map(task =>
                    <Task
                      task={task}
                      index={task.order}
                      onDelete={handleDeleteTask}
                      onEdit={() => handleEditTask(task)}
                      key={task.id}
                    />,
                  )}
                  {providedCol.placeholder}
                </div>
              )}
            </Droppable>

            <div className="column-buttons col-bttn" >
              <button
                type='button'
                className="column-bttn"
                onClick={handleCreateTask}
              >
                {t('TASKS.ADD')}
              </button>
            </div>
          </div>

        </section>
      )}
    </Draggable>
  );
};
