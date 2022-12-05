import { nanoid } from 'nanoid';
import { useTranslation } from 'react-i18next';

import './Home.pcss';
import photoBoy1 from './members/boy1.png';
import photoBoy2 from './members/boy2.png';
import photoGirl from './members/girl.png';

import { teamMembers } from '@/app/constants';
import welcomeImage1 from '@/assets/png/welcome-img.png';
import welcomeImage2 from '@/assets/png/welcome-section2.png';

const getImg = (name: string) => {
  switch (name) {
    case 'boy1': return photoBoy1;
    case 'boy2': return photoBoy2;
    case 'girl': return photoGirl;
    default: return undefined;
  }
};

export const Home = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <section className="home">
        <div className="container">
          <div className="home__wrapper">
            <div className="home__text">
              <h1 className='home__heading'>
                <span className='home__heading_m'>{t('WELCOME.HEADING1')}</span>
                <span className='home__heading_s'>{t('WELCOME.HEADING2')}</span>
                <span className='home__heading_l'>{t('WELCOME.HEADING3')}</span>
              </h1>
              <div className="home__descr" >
                <p>{t('WELCOME.DESCR_P1')}</p>

                <div>
                  <p>{t('WELCOME.DESCR_P2')}</p>
                  <ul>
                    <li><span>{t('WELCOME.DESCR_POINT_1')}</span></li>
                    <li><span>{t('WELCOME.DESCR_POINT_2')}</span></li>
                    <li><span>{t('WELCOME.DESCR_POINT_3')}</span></li>
                    <li><span>{t('WELCOME.DESCR_POINT_4')}</span></li>
                  </ul>
                </div>
              </div>
            </div>

            <img className='home__img' src={welcomeImage1} alt="Welcome" />
          </div>
        </div>
      </section>

      <section className="home-video">
        <div className="container">
          <div className="home-video__wrapper">
            <h2 className='home-video__heading'>{t('WELCOME.HEADING_VIDEO')}</h2>
            <div className="home-video__inner-wrapper">
              <img src={welcomeImage2} alt="welcome" className='video__img'/>

              <iframe src='https://www.youtube.com/embed/e9W9aJrerUc'
                frameBorder='0'
                allowFullScreen
                title='video'
                className='video-frame'
              />
            </div>
          </div>
        </div>

      </section>

      <section className="home-team">
        <div className="container">
          <h2 className='home-team__heading'>{t('WELCOME.HEADING_TEAM')}</h2>
          <ul className='team-members'>
            {teamMembers.map(member => (
              <li key={member.id} className='member__card'>
                <img src={getImg(member.img)} alt="member" className='member__img'/>
                <div className="member__text">
                  <p className='member__name'>{t(member.name)}</p>

                  <ul className='member_points'>
                    {
                      member.points.map(point => (
                        <li key={nanoid()} className='duty-point'><span>{t(point)}</span></li>
                      ))
                    }
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </section>
    </>
  );
};
