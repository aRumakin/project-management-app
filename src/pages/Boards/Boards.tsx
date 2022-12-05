import { Link } from '@tanstack/react-location';
import { useTranslation } from 'react-i18next';

import { useState } from 'react';

import { boardsApi } from '@/api/services/BoardsService';
import { BoardInfo, IBoard } from '@/app/types';
import Confirmation from '@/components/Confirmation/Confirmation';
import { Loader } from '@/components/Loader/Loader';
import { ModalData, ModalForm } from '@/components/ModalForm/ModalForm';
import { useAppSelector } from '@/hooks/redux';
import './Boards.pcss';

export const Boards = (): JSX.Element => {
  const [showModalCreateBoard, setShowModalCreateBoard] = useState(false);
  const [showModalEditBoard, setShowModalEditBoard] = useState(false);
  const [editedBoard, setEditedBoard] = useState<IBoard | null>(null);

  const { user } = useAppSelector(
    state => state.authReducer,
  );

  const { data: boards,  isLoading } = boardsApi.useGetAllBoardsQuery();
  const [createBoard, { isLoading: crIsLoading }] = boardsApi.useCreateBoardMutation();
  const [deleteBoard, { isLoading: delIsLoading }] = boardsApi.useDeleteBoardMutation();
  const [updateBoard, { error, isLoading: updIsLoading }] = boardsApi.useUpdateBoardMutation();

  const { t } = useTranslation();

  const handleCreate =  () => {
    setShowModalCreateBoard(true);
  };

  const createNewBoard = async (data: ModalData) => {
    setShowModalCreateBoard(false);

    if (data.title){
      await createBoard({
        title: JSON.stringify({
          title: data.title,
          description: data.description,
        }),
        owner: user?.name || '',
        users: [''],
      });
    }
  };

  const handleRemove = async (id: string) => {
    await deleteBoard(id);
  };

  const handleUpdate = (board: IBoard) => {
    setShowModalEditBoard(true);
    setEditedBoard(board);
  };

  const editBoard = async (data: ModalData) => {
    setShowModalEditBoard(false);

    if (editedBoard){
      await updateBoard({
        boardId: editedBoard.id,
        board: {
          title: JSON.stringify({
            title: data.title,
            description: data.description,
          }),
          owner: editedBoard.owner,
          users: editedBoard.users,
        },

      });
    }

    setEditedBoard(null);
  };

  /*  delete confirmation  */
  const [showConfirmation, setShowConfirmation ] = useState(false);
  const [boardIdToDelete, setBoardIdToDelete ] = useState('');
  const onClickDeleteHandle = (id: string) => {
    setShowConfirmation(true);
    setBoardIdToDelete(id);
  };

  return (
    <section className="boards">

      {((isLoading || crIsLoading || delIsLoading || updIsLoading) && <Loader/> )}

      {((showModalCreateBoard) &&
      <ModalForm
        type ='CREATE_BOARD'
        modalSubmit={createNewBoard}
        modalAbort={()=>setShowModalCreateBoard(false)}
      />)}

      {((showModalEditBoard) &&
      <ModalForm
        type ='EDIT_BOARD'
        modalSubmit={editBoard}
        modalAbort={()=>setShowModalEditBoard(false)}
        initialData={{
          title: (JSON.parse(editedBoard!.title) as BoardInfo).title || '',
          description: (JSON.parse(editedBoard!.title) as BoardInfo).description || '',
        }}
      />)}

      {(showConfirmation) && <Confirmation componentName="BOARD" deleteFunc={() => handleRemove(boardIdToDelete)} hideConfirmFunc={setShowConfirmation}/>}

      <div className="container">
        <h1 className='boards-heading'>{t('BOARD.BOARDS')}</h1>
        <div className="boards_wrapper">
          <ul className="board-list">
            {boards && boards.map(board =>
              <li key = {board.id} className='board-item'>
                <div className="board-content">
                  <div className="board-top">
                    <p className='board-owner'>
                      {t('BOARD.OWNER')} {board.owner}
                    </p>
                    <div className="board-buttons">
                      <button
                        type ='button'
                        onClick={()=>handleUpdate(board)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="board-button-icon">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                      </button>

                      <button
                        type ='button'
                        onClick={() => onClickDeleteHandle(board.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="board-button-icon">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <Link to={`/boards/${board.id}`}>
                    <div className="board-info">
                      <p className='board-title'>

                        {(JSON.parse(board.title) as BoardInfo).title}

                      </p>
                      <p className='board-description'>
                        {(JSON.parse(board.title) as BoardInfo).description}
                      </p>
                    </div>
                  </Link>

                </div>

              </li>,
            )}

            <li className='board-button'>
              <button
                type ='button'
                onClick={handleCreate}
                className="board-button-add"
              >
              + {t('BOARD.ADD')}
              </button>
            </li>

          </ul>

          {error &&
          <span>
            {`${JSON.stringify(error)}`}
          </span>
          }
        </div>
      </div>
    </section>
  );
};
