import React from 'react';
import styles from './Paper.module.css';

const Paper = ({...args}) => (
  <>
    <div className={styles.paper} {...args} />
  </>
);

export default Paper;
