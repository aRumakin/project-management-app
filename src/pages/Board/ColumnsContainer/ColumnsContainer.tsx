import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { useState } from 'react';

import { Column } from '../Column/Column';

import { columnsApi } from '@/api/services/ColumnsService';
import { tasksApi } from '@/api/services/TasksService';
import { IColumn, ITaskResponse } from '@/app/types';
import { Loader } from '@/components/Loader/Loader';
import './ColumnsContainer.pcss';
import { ModalData, ModalForm } from '@/components/ModalForm/ModalForm';
import { getBiggestOrder } from '@/utils/utils';

interface ColumnsContainerProps {
  boardId: string;
  activeTask: string | null;
}

export const ColumnsContainer = ({ boardId, activeTask }: ColumnsContainerProps): JSX.Element => {
  const [showModalCreateCol, setShowModalCreateCol] = useState(false);

  const { data: columns, isLoading } = columnsApi.useGetColumnsQuery(boardId);
  const [createCol, { error, isLoading: crLoading }] = columnsApi.useCreateColumnMutation();
  const [deleteCol, { isLoading: delLoading }] = columnsApi.useDeleteColumnMutation();
  const [updateColOrder, { isLoading: updateColLoading }] = columnsApi.useUpdateColumnSetMutation();

  const [getTasksByColumn] = tasksApi.useGetTasksByColumnMutation();
  const [updateTaskSet, { isLoading: updateTaskLoading }] = tasksApi.useUpdateTasksSetMutation();

  const { t } = useTranslation();

  const handleCreate = () => {
    setShowModalCreateCol(true);
  };

  const createNewColumn = async (data: ModalData) => {
    setShowModalCreateCol(false);

    if (data.title){
      await createCol({
        col: {
          title: data.title,
          order: getBiggestOrder(columns) + 1,
        },
        boardId,
      });
    }
  };

  const transformColumns = () => {
    const transformedColumns = columns!.map(el => {
      const { id, order } = el;
      return { _id: id, order };
    });
    return transformedColumns;
  };

  const transformTasks = (tasks: ITaskResponse[]) => {
    const transformedTasks = tasks.map(el => {
      const { _id: id, order, columnId } = el;
      return { _id: id , order, columnId };
    });
    return transformedTasks;
  };

  const onDragEndColumn = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    try {
      let reorderedColumns = transformColumns().sort((a, b) => (a.order - b.order));
      const [toIdx, fromIdx] = [destination!.index, source.index];
      const movedColumn = reorderedColumns.find(({ _id }) => _id === draggableId);
      if (!(toIdx + 1 - reorderedColumns.length)) {
        reorderedColumns.splice(toIdx, 1);
        reorderedColumns.push(movedColumn!);
      } else {
        reorderedColumns.splice(fromIdx, 1);
        reorderedColumns.splice(toIdx, 0, movedColumn!);
      }
      reorderedColumns = reorderedColumns.map((el, i) => ({ ...el, order: i }));
      await updateColOrder(reorderedColumns);
      toast.success(t('TOASTER.SUCCESS_COL'));
    } catch {
      toast.error(t('TOASTER.SERV_ERR'));
    }
  };

  const onDragEndTask = async (result: DropResult) => {

    const { destination, source, draggableId } = result;

    const columnToId = destination!.droppableId;

    const tasksSetToColumn = await getTasksByColumn({ boardId, colId: columnToId });

    try {
      const copyedArrTasks = transformTasks((tasksSetToColumn['data'] as ITaskResponse[]));

      let reordered = [...copyedArrTasks]
        .sort((a, b) => (a.order - b.order))
        .map((el, i) =>( { ...el, order: i }));    // set orders by ascending

      if (destination?.droppableId === source.droppableId) {
        const movedTask = reordered.find(({ _id }) => _id === draggableId);
        const [fromIdx, toIdx] = [movedTask!.order, destination.index];

        if (!(toIdx + 1 - reordered.length)) {
          reordered.splice(fromIdx, 1);
          reordered.push(movedTask!);
        } else {
          reordered.splice(fromIdx, 1);
          reordered.splice(toIdx, 0, movedTask!);
        }
      } else {
        const movedTask = {
          _id: draggableId,
          order: destination!.index,
          columnId: destination!.droppableId,
        };
        reordered.splice(destination!.index, 0, movedTask);
      }
      reordered = reordered.map((el, i) => ({ ...el, order: i }));

      await updateTaskSet(reordered);
      toast.success(t('TOASTER.SUCCESS_TASK'));

    } catch {
      toast.error(t('TOASTER.SERV_ERR'));
    }

  };

  const handleDragEnd = async (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    if (destination.droppableId === 'all-columns') {

      await onDragEndColumn(result);
    } else {
      await onDragEndTask(result);
    }
  };

  const handleDelete = async (col: IColumn) => {
    await deleteCol({
      col,
      boardId,
    });
  };

  const handleShuffle = async () => {
    if (columns) {
      await updateColOrder([...columns]
        .sort((a, b)=>(a.order - b.order))
        .map((el, i )=>({
          _id: el.id,
          order: columns.length - i,
        })),
      );
    }
  };

  return (
    <section className="columns">
      {error && (
        <p> {`${JSON.stringify(error)}`}</p>
      )}

      {((isLoading || delLoading || crLoading || updateColLoading || updateTaskLoading) && <Loader />)}

      {((showModalCreateCol) &&
        <ModalForm
          type='CREATE_COLUMN'
          modalSubmit={createNewColumn}
          modalAbort={() => setShowModalCreateCol(false)}
        />)}

      <DragDropContext
        onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {provided => (
            <div className="columns-wrapper"
              {...provided.droppableProps}
              ref={provided.innerRef}>
              {columns && [...columns]
                .sort((a, b) => (a.order - b.order))
                .map(col =>
                  <Column
                    column={col}
                    boardId={boardId}
                    onDelete={handleDelete}
                    key={col.id}
                    index={col.order}
                    activeTask = {activeTask}
                  />,
                )}
              {provided.placeholder}
              <div className="columns-add">
                <button
                  type='button'
                  className='columns-add-bttn'
                  onClick={handleCreate}
                >
                  {t('TASKS.ADD_COL')}
                </button>

                {(columns && columns?.length > 1) && (
                  <button
                    type='button'
                    className='columns-add-bttn'
                    onClick={handleShuffle}
                  >
                    <span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M15.97 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 11-1.06-1.06l3.22-3.22H7.5a.75.75 0 010-1.5h11.69l-3.22-3.22a.75.75 0 010-1.06zm-7.94 9a.75.75 0 010 1.06l-3.22 3.22H16.5a.75.75 0 010 1.5H4.81l3.22 3.22a.75.75 0 11-1.06 1.06l-4.5-4.5a.75.75 0 010-1.06l4.5-4.5a.75.75 0 011.06 0z" clipRule="evenodd" />
                      </svg>
                    </span>

                    <span>{t('TASKS.REVERSE')}</span>
                  </button>
                )}
              </div>

            </div>
          )}
        </Droppable>

      </DragDropContext>
    </section>
  );
};
