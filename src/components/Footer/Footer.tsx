import './Footer.pcss';

import ghLogo from '@/assets/png/github_logo.png';
import rssLogo from '@/assets/png/rss_school_js.png';

export const Footer = (): JSX.Element => (
  <footer className="footer">
    <div className='container'>
      <div className="footer__wrapper">
        <a className="footer__rss" href="https://rs.school/react/">
          <img src={rssLogo} alt="rss-logo" />
        </a>

        <div className="footer__team">
          <img className="footer__gh_logo" src={ghLogo} alt="github_logo" />
          <ul className="footer__team-list">
            <li className="footer__team-member">
              <a href="https://github.com/aRumakin">Andrei Rumakin</a>
            </li>
            <li className="footer__team-member">
              <a href="https://github.com/TatianaRusak">Tatsiana Rusak</a>
            </li>
            <li className="footer__team-member">
              <a className='border-r-0' href="https://github.com/m208">Andrey Komissarov</a>
            </li>
          </ul>
        </div>

        <div className="footer__year">2022</div>
      </div>
    </div>
  </footer>
);
