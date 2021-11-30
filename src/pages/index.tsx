import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Info } from '../components/Info';
import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';
import { PreviewButton } from '../components/PreviewButton';

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

  const [posts, setPosts] = useState<Post[]>([]);
  const [nextPage, setNextPage] = useState<string | null>(null);

  useEffect(() => {
    setPosts(results);
    setNextPage(next_page);
  }, [results, next_page]);

  async function handleLoadMorePosts(): Promise<void> {
    const response = await fetch(nextPage);
    const data = await response.json();

    const newPosts = data.results.map((post) => {
      return {
        uid: post.uid,
        first_publication_date: post.first_publication_date,
        data: {
          title: post.data.title,
          subtitle: post.data.subtitle,
          author: post.data.author,
        },
      };
    });

    setPosts([...posts, ...newPosts]);
    setNextPage(data?.next_page);
  }

  return (
    <>
      <Head>
        <title>Blog | Home</title>
      </Head>

      <main className={styles.container}>
        {posts?.map((post) => (
          <div className={styles.post} key={post.uid}>
            <Link href={`/post/${post.uid}`}>
              <a>
                <h1>{post.data?.title}</h1>
                <p>{post.data?.subtitle}</p>
                <Info
                  createdAt={format(
                    new Date(post.first_publication_date),
                    ' dd MMM yyyy',
                    {
                      locale: ptBR,
                    }
                  )}
                  author={post.data?.author}
                />
              </a>
            </Link>
          </div>
        ))}

        {nextPage ? (
          <button
            type="button"
            className={styles.load}
            onClick={handleLoadMorePosts}
          >
            Carregar mais posts
          </button>
        ) : (
          ''
        )}

        <PreviewButton />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 2,
    }
  );

  const posts = postsResponse.results.map((post) => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
    revalidate: 60 * 10, // 10 minutes
  };
};
