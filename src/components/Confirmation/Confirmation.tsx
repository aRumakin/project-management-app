import { useTranslation } from 'react-i18next';

import React, { Dispatch, SetStateAction, useEffect } from 'react';

import './Confirmation.pcss';

interface ConfirmationProps {
  componentName: string;
  deleteFunc: () => void;
  hideConfirmFunc: Dispatch<SetStateAction<boolean>>;
}

const Confirmation = ({ componentName, deleteFunc, hideConfirmFunc }: ConfirmationProps) => {
  const { t } = useTranslation();

  const onClickDelHandle = () => {
    deleteFunc();
    hideConfirmFunc(false);
  };

  const onClickCancelHandle = () => {
    hideConfirmFunc(false);
  };

  useEffect(() => {
    const keyUpHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideConfirmFunc(false);
      }
    };
    document.addEventListener('keyup', keyUpHandler);
    return () => {
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [hideConfirmFunc]);

  return (
    <>
      <div
        className='confirm-overlay'
        onClick={onClickCancelHandle}
        onKeyPress={()=>{ }}
        role='presentation'
      />

      <div className="confirm-dialog">
        <p className="confirm-question">{t('CONFIRM.QUESTION')} {t(`CONFIRM.${componentName}`)}?</p>
        <div className="confirm-buttons">
          <button type='button' className='confirm-btn del-btn' onClick={onClickDelHandle}>{t('CONFIRM.DELETE')}</button>
          <button type='button' className='confirm-btn cancel-btn' onClick={onClickCancelHandle}>{t('CONFIRM.CANCEL')}</button>
        </div>
      </div>

    </>

  );
};

export default Confirmation;
