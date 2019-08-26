import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import styles from './App.module.css';
import { Header } from './components/header';
import { Menu } from './components/menu';
import { PageContent } from './components/pageContent';

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <section className={styles.content}>
          <nav className={styles.menu}>
            <Menu />
          </nav>
          <main className={styles.main}>
            <PageContent />
          </main>
        </section>
      </BrowserRouter>
    </>
  );
}

export default App;
