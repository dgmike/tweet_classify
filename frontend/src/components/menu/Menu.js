import React from 'react';
import styles from './Menu.module.css';

const Menu = () => (
  <>
    <a href="/" class={styles.link}>Dashboard</a>
    <a href="/terms" class={styles.link}>Terms</a>
  </>
);

export default Menu;
