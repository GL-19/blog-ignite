import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { Navigation } from '../../components/Navigation';
import { Info } from '../../components/Info';
import { UtterancesComments } from '../../components/UtterancesComments';
import { calculateReadingTime } from '../../utils/calculateReadingTime';
import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';
import { PreviewButton } from '../../components/PreviewButton';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
  navigation: {
    previousPost: null | {
      title: string;
      uid: string;
    };
    nextPost: null | {
      title: string;
      uid: string;
    };
  };
}

export default function Post({ post, navigation }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <h1 className={styles.loading}>Carregando...</h1>;
  }

  const formattedFirstPublicationDate = format(
    new Date(post.first_publication_date),
    ' dd MMM yyyy',
    {
      locale: ptBR,
    }
  );

  return (
    <>
      <Head>
        <title>Blog | {post.data.title}</title>
      </Head>

      <main className={styles.container}>
        <img src={post.data.banner.url} alt="banner" />

        <article className={styles.content}>
          <h1>{post.data.title}</h1>

          <Info
            createdAt={formattedFirstPublicationDate}
            author={post.data?.author}
            readingTime={calculateReadingTime(post.data.content)}
          />

          {post.last_publication_date && (
            <p className={styles.publicationDate}>
              {format(
                new Date(post.last_publication_date),
                "'* editado em' dd MMM yyyy, 'às' HH:mm",
                {
                  locale: ptBR,
                }
              )}
            </p>
          )}

          {post.data.content.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph, index) => (
                <p key={index}>{paragraph.text}</p>
              ))}
            </section>
          ))}

          <Navigation
            nextPost={navigation?.nextPost}
            previousPost={navigation?.previousPost}
          />

          <UtterancesComments />

          <PreviewButton />
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { slug: 'como-utilizar-hooks' } },
      { params: { slug: 'criando-um-app-cra-do-zero' } },
    ],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {});

  const post: Post = {
    first_publication_date: response.first_publication_date,
    last_publication_date: response.last_publication_date,
    uid: response.uid,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: { ...response.data.banner },
      author: response.data.author,
      content: [...response.data.content],
    },
  };

  const nextPostResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date]',
    }
  );

  const previousPostResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date desc]',
    }
  );

  const nextPost =
    nextPostResponse?.results.length > 0
      ? {
          title: nextPostResponse.results[0]?.data?.title,
          uid: nextPostResponse.results[0]?.uid,
        }
      : null;

  const previousPost =
    previousPostResponse?.results.length > 0
      ? {
          title: previousPostResponse.results[0]?.data?.title,
          uid: previousPostResponse.results[0]?.uid,
        }
      : null;

  return {
    props: {
      post,
      navigation: {
        nextPost,
        previousPost,
      },
    },
    revalidate: 60 * 60 * 24, // 1 dia
  };
};
