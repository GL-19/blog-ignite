import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';

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

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
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

          {post.data.content.map((section, sectionIndex) => (
            <section key={sectionIndex}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph.text}</p>
              ))}
            </section>
          ))}
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
    uid: response.uid,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: { ...response.data.banner },
      author: response.data.author,
      content: [...response.data.content],
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60 * 24, // 1 dia
  };
};
