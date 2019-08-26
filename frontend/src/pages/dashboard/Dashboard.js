import React from 'react';
import { Paper } from '../../components/paper';
import styles from './Dashboard.module.css';

console.log(styles)

const Dashboard = () => (
  <>
  <div className={styles.row}>
    <Paper>
      <h1>Dashboard</h1>
    </Paper>
    <Paper>
      <h1>Dashboard</h1>
    </Paper>
  </div>
  </>
);

export default Dashboard;
