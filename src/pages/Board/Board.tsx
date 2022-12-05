import { Link, MakeGenerics, useMatch, useSearch } from '@tanstack/react-location';
import { useTranslation } from 'react-i18next';

import { ColumnsContainer } from './ColumnsContainer/ColumnsContainer';

import { boardsApi } from '@/api/services/BoardsService';
import { BoardInfo } from '@/app/types';
import { Loader } from '@/components/Loader/Loader';
import './Board.pcss';

type LocationGenerics = MakeGenerics<{
  Search: {
    task?: string;
  };
}>;

export const Board = (): JSX.Element => {
  const { data: { boardId } } = useMatch();
  const { data: board,  isLoading, error } = boardsApi.useGetBoardQuery(boardId as string);

  const { t } = useTranslation();

  const search = useSearch<LocationGenerics>();

  const title = board? (JSON.parse(board.title) as BoardInfo).title : '';
  const description = board? (JSON.parse(board.title) as BoardInfo).description : '';

  const activeTask = (board && search.task) ? search.task : null;

  return (
    <section className="board">
      {(isLoading && <Loader/> )}

      {error && (
        <div className='flex flex-col items-center mt-10'>
          <p className='text-center text-3xl font-semibold'>{t('BOARD.NOT_EXIST')}</p>
          <Link to='/boards' className='text-center text-xl text-chocolate-500 font-semibold underline hover:no-underline mt-2'>
            {t('BOARD.TO_BOARDS')}
          </Link>
        </div>
      )}

      {board && (
        <>
          <div className="board-heading">
            <span className='board-crumbs'>
              <Link to='/boards'>
                {t('BOARD.TO_BOARDS')}
              </Link>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" strokeWidth={2} stroke="currentColor" className="w-3 h-3 mx-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
              </svg>

            </span>
            <h1 className = 'board-info'>
              <span className='board-title'>{title}</span>
              <span className="board-description">
                {`${description? `: ${description}` : ''}`}</span>
            </h1>
          </div>

          <div className="board-wrapper">
            <ColumnsContainer
              boardId={board.id}
              activeTask={activeTask}
            />
          </div>
        </>
      )}
    </section>
  );
};
