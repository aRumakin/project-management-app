import { Link } from '@tanstack/react-location';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { useRef, useState } from 'react';

import { Loader } from '../Loader/Loader';

import { tasksApi } from '@/api/services/TasksService';
import './SearchBar.pcss';
import { ITask } from '@/app/types';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

export function SearchBar () {
  const [showResults, setShowResults] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState<Array<ITask>>([]);

  const [getTasks, { isLoading, isSuccess }] = tasksApi.useGetTasksSetbySearchMutation();

  const ref = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(ref, () => { if (showResults) {setShowResults(false);} });

  const { t } = useTranslation();

  const searchRequest = async () => {

    try {
      const results = await getTasks(inputValue);
      if (results['data']) {
        setSearchResults(results['data'] as Array<ITask>);
      }
    } catch {
      toast.error(t('TOASTER.SERV_ERR'));
    }
    setShowResults(true);
  };

  return (
    <>
      {(isLoading  && <Loader />)}

      <div
        className="search-wrapper"
        ref={ref}
      >
        <input
          type="search"
          className='search-input'
          placeholder={`${t('SEARCH.PLACEHOLDER')}`}
          value={inputValue}
          onChange={e=>setInputValue(e.target.value)}
          onKeyUp={e=>{if(e.code === 'Enter'){
            searchRequest().catch(()=>{});
          }}}
        />

        {showResults && (
          <div className="search-output">

            {searchResults && searchResults.length > 0 && (
              searchResults.map(res =>

                <Link
                  className="search-results"
                  key = {res.id}
                  to={`/boards/${res.boardId}?task=${res.id}`}

                  onClick={()=>setShowResults(false)}
                >
                  <span className="result-title">
                    {res.title}
                  </span>
                  <span className="result-divider">:</span>
                  <span className="result-description">
                    {res.description}
                  </span>

                </Link>,
              )
            )}

            {isSuccess && searchResults.length === 0 && (
              <div className="search-empty">
                {t('SEARCH.NOT_FOUND')}
              </div>
            )}

          </div>
        )}

      </div>
    </>

  );
}
