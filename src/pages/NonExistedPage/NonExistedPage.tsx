import { useTranslation } from 'react-i18next';
import './NonExistedPage.pcss';

export const NonExistedPage = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <section className="page-404">
      <h1 className='page-404-heading'>{t('404.ERROR')}</h1>
      <p>{t('404.NOT_FOUND')}</p>
    </section>
  );
};
