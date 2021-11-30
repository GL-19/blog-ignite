import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface PostTextSection {
  heading: string;
  body: {
    text: string;
  }[];
}

interface Post {
  uid?: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
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

interface PostNavigation {
  title: string;
  uid: string;
}

interface PostProps {
  post: Post;
  nextPost: PostNavigation;
  previousPost: PostNavigation;
}

export default function Post({
  post,
  nextPost,
  previousPost,
}: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  function calculateReadingTime(content: PostTextSection[]): string {
    const totalWords = content.reduce((currentWords, currentSection) => {
      const headingWords = currentSection.heading.split(' ').length;

      const bodyWords = currentSection.body.reduce(
        (currentBodyWords, currentParagraph) => {
          const paragraphWords = currentParagraph.text.split(' ').length;
          return currentBodyWords + paragraphWords;
        },
        0
      );

      return currentWords + headingWords + bodyWords;
    }, 0);

    const totalTime = Math.ceil(totalWords / 200);

    return `${totalTime} min`;
  }

  return (
    <>
      <Head>
        <title>Blog | {post.data.title}</title>
      </Head>
      <main className={styles.container}>
        <img src={post.data.banner.url} alt="banner" />
        <article className={styles.content}>
          <h1>{post.data.title}</h1>

          <div className={styles.info}>
            <p>
              <FiCalendar />
              {format(new Date(post.first_publication_date), ' dd MMM yyyy', {
                locale: ptBR,
              })}
            </p>
            <p>
              <FiUser />
              {post.data?.author}
            </p>
            <p>
              <FiClock />
              {calculateReadingTime(post.data.content)}
            </p>
          </div>

          <p className={styles.publicationDate}>
            {post?.last_publication_date &&
              format(
                new Date(post.last_publication_date),
                "'* editado em' dd MMM yyyy, 'às' HH:mm",
                {
                  locale: ptBR,
                }
              )}
          </p>

          {post.data.content.map((section, sectionIndex) => (
            <section key={sectionIndex}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph.text}</p>
              ))}
            </section>
          ))}

          <nav>
            <p>{previousPost.title}</p>
            <p>{nextPost.title}</p>
          </nav>
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

  const post = {
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

  const nextPost: PostNavigation = {
    title:
      nextPostResponse.results.length > 0
        ? nextPostResponse.results[0]?.data?.title
        : '',
    uid:
      nextPostResponse.results.length > 0
        ? nextPostResponse.results[0]?.uid
        : '',
  };

  const previousPostResponse = await prismic.query(
    [Prismic.Predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 1,
      after: response.id,
      orderings: '[document.first_publication_date desc]',
    }
  );

  const previousPost: PostNavigation = {
    title:
      previousPostResponse.results.length > 0
        ? previousPostResponse.results[0]?.data?.title
        : '',
    uid:
      previousPostResponse.results.length > 0
        ? previousPostResponse.results[0]?.uid
        : '',
  };

  console.log('response', response);
  console.log('next-post: ', nextPost);
  console.log('previous-post: ', previousPost);

  return {
    props: {
      post,
      previousPost,
      nextPost,
    },
    revalidate: 60 * 60 * 24, // 1 dia
  };
};
