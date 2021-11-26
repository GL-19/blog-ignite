import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { FiUser, FiCalendar } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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
  return (
    <>
      <Head>
        <title>Blog | {post.data.title}</title>
      </Head>
      <main className={styles.container}>
        <img src={post.data.banner.url} alt="banner" />
        <article className={styles.content}>
          <div className={styles.info}>
            <p>
              <FiCalendar />
              {format(new Date(post.first_publication_date), ' dd MMM yyyy', {
                locale: ptBR,
              })}
            </p>
            <p>
              <FiUser width="20px" />
              {post.data?.author}
            </p>
          </div>

          <h1>{post.data.title}</h1>

          {post.data.content.map((section, sectionIndex) => (
            <section key={sectionIndex}>
              <h1>{section.heading}</h1>
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
  /* const prismic = getPrismicClient();
  const posts = await prismic.query(TODO); */
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps<PostProps> = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('posts', String(slug), {});

  // console.log(JSON.stringify(response, null, 2));

  const post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,
    data: {
      title: response.data.title,
      banner: { ...response.data.banner },
      author: response.data.author,
      content: [...response.data.content],
    },
  };

  return {
    props: {
      post,
    },
  };
};
