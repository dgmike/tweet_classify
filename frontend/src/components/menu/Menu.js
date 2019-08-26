import React from 'react';
import styles from './Menu.module.css';
import { NavLink } from 'react-router-dom';

const Menu = ({ match }) => {
  return (
    <>
      <NavLink to="/" exact className={styles.link} activeClassName={styles.active}>Dashboard</NavLink>
      <NavLink to="/terms" className={styles.link} activeClassName={styles.active}>Terms</NavLink>
    </>
  );
};

export default Menu;
