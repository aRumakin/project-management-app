import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { useEffect } from 'react';
import './ModalForm.pcss';

export type ModalFormTypes = 'CREATE_COLUMN' | 'CREATE_BOARD' | 'EDIT_BOARD' | 'CREATE_TASK' | 'EDIT_TASK';

interface ModalFormProps {
  type: ModalFormTypes;
  modalSubmit: (data: ModalData) => void;
  modalAbort: () => void;
  initialData?: ModalData;
}

export interface ModalData {
  title: string;
  description?: string;
}
export const ModalForm = ({
  type, modalSubmit, modalAbort, initialData,
}: ModalFormProps): JSX.Element => {

  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data: Record<string, string>) => {
    const { description, title } = data;
    modalSubmit({ description, title });
  };

  useEffect(() => {
    const keyUpHandler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        modalAbort();
      }
    };
    document.addEventListener('keyup', keyUpHandler);
    return () => {
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, [modalAbort]);

  return (
    <>
      <div
        className='modal-overlay'
        onClick={modalAbort}
        role='presentation'
        onKeyPress={()=>{ }}
      />

      <div className="modal-inner">
        <div className="modal-close">
          <button
            type='button'
            className="modal-close-bttn"
            onClick={modalAbort}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className="w-6 h-6">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form className="modalform" onSubmit={(handleSubmit(onSubmit))}>
          <h2 className="modalform-header">{t(`${type}.HEADING`)}</h2>

          <div className="modalform-item">
            <input
              type="text"
              placeholder={(t(`${type}.NAME`)).toString()}
              className='modalform-input'
              {...register('title', { required: true })}
              aria-invalid={errors.title ? 'true' : 'false'}
              defaultValue={initialData?.title}
            />

            <div className="error-field">
              {errors.title?.type === 'required' && (
                <span role="alert">{(t(`${type}.REQUIRED_NAME`))}</span>
              )}
            </div>
          </div>

          {type !== 'CREATE_COLUMN' && (

            <div className="modalform-item">
              <textarea
                placeholder={t(`${type}.DESCRIPTION`).toString() }
                className='modalform-input'
                cols={60} rows={5}
                {...register('description', {
                  required: (type === 'CREATE_TASK'),
                })}
                aria-invalid={errors.description ? 'true' : 'false'}
                defaultValue={initialData?.description}
              />

              <div className="error-field">
                {errors.description?.type === 'required' && (
                  <span role="alert">{(t(`${type}.REQUIRED_DESCRIPTION`))}</span>
                )}
              </div>
            </div>

          )}

          <div className="modalform-item">
            <input
              type="submit"
              className='modalform-button'
              value={t(`${type}.SUBMIT`).toString().toUpperCase()}/>
          </div>

        </form>
      </div>
    </>
  );
};
