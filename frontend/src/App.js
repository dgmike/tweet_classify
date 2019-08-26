import React from 'react';
import styles from './App.module.css';
import { Header } from './components/header';
import { Menu } from './components/menu';
import { PageContent } from './components/pageContent';

function App() {
  return (
    <>
      <Header />
      <section class={styles.content}>
        <nav class={styles.menu}>
          <Menu />
        </nav>
        <main class={styles.main}>
          <PageContent />
        </main>
      </section>
    </>
  );
}

export default App;
