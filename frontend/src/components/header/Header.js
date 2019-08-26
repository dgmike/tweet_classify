import React from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';

const Header = () => (
  <header className={styles.header}>
    <div>
      <Link to="/" className={styles.pagename}>Tweet classify</Link>
    </div>
    <div>
      <a href="https://github.com/dgmike/tweet_classify">fork on gthub</a>
    </div>
  </header>
);

export default Header;
