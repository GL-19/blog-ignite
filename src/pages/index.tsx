import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../services/prismic';

// import commonStyles from '../styles/common.module.scss';
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

export default function Home(props: HomeProps): JSX.Element {
  const {
    postsPagination: { results, next_page },
  } = props;

  return (
    <>
      <Head>
        <title>Blog | Home</title>
      </Head>
      <main className={styles.container}>
        {results?.map(post => (
          <div className={styles.post} key={post.uid}>
            <Link href={`/post/${post.uid}`}>
              <a>
                <h1>{post.data.title}</h1>
                <p>{post.data.subtitle}</p>
                <div className={styles.info}>
                  <p>{post.first_publication_date}</p>
                  <p>{post.data.author}</p>
                </div>
              </a>
            </Link>
          </div>
        ))}

        {next_page ? <p className={styles.load}>Carregar mais posts</p> : ''}

        <button type="button">Sair do preview</button>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 100,
    }
  );

  // console.log(JSON.stringify(postsResponse, null, 2));

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(
        post.last_publication_date
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  console.log(JSON.stringify(posts, null, 2));

  return {
    props: {
      postsPagination: {
        next_page: null,
        results: [...posts],
      },
    },
  };
};
