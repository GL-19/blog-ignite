import { GetStaticProps } from 'next';
import Head from 'next/head';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <>
      <Head>
        <title>Blog | Home</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.post}>
          <h1>Criando um app CRA do zero</h1>
          <p>
            Tudo sobre como criar a sua primeira aplicação utilizando Create
            React App
          </p>
          <div className={styles.info}>
            <p>19 Abr 2021</p>
            <p>Danilo Vieira</p>
          </div>
        </div>
        <div className={styles.post}>
          <h1>Criando um app CRA do zero</h1>
          <p>
            Tudo sobre como criar a sua primeira aplicação utilizando Create
            React App
          </p>
          <div className={styles.info}>
            <p>19 Abr 2021</p>
            <p>Danilo Vieira</p>
          </div>
        </div>
        <div className={styles.post}>
          <h1>Criando um app CRA do zero</h1>
          <p>
            Tudo sobre como criar a sua primeira aplicação utilizando Create
            React App
          </p>
          <div className={styles.info}>
            <p>19 Abr 2021</p>
            <p>Danilo Vieira</p>
          </div>
        </div>
        <div className={styles.post}>
          <h1>Criando um app CRA do zero</h1>
          <p>
            Tudo sobre como criar a sua primeira aplicação utilizando Create
            React App
          </p>
          <div className={styles.info}>
            <p>19 Abr 2021</p>
            <p>Danilo Vieira</p>
          </div>
        </div>
        <p className={styles.load}>Carregar mais posts</p>
        <button type="button">Sair do preview</button>
      </main>
    </>
  );
}

/*  export const getStaticProps = async () => {
    const prismic = getPrismicClient();
    const postsResponse = await prismic.query(TODO);

    //TODO 
  } */
