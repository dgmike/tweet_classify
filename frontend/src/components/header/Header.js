import React from 'react';
import styles from './Header.module.css';

const Header = () => (
  <header class={styles.header}>
    <div>
      <a href="/">Tweet classify</a>
    </div>
    <div>
      <a href="https://github.com/dgmike/tweet_classify">fork on gthub</a>
    </div>
  </header>
);

export default Header;
