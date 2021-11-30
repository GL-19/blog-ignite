import Link from 'next/link';
import styles from './styles.module.scss';

interface NavigationProps {
  previousPost: null | {
    title: string;
    uid: string;
  };
  nextPost: null | {
    title: string;
    uid: string;
  };
}

export function Navigation({
  previousPost,
  nextPost,
}: NavigationProps): JSX.Element {
  return (
    <nav className={styles.container}>
      <div className={styles.previousPost}>
        {previousPost && (
          <Link href={`/post/${previousPost.uid}`}>
            <a>
              <h2>{previousPost?.title}</h2>
              <p>Post anterior</p>
            </a>
          </Link>
        )}
      </div>

      <div className={styles.nextPost}>
        {nextPost && (
          <Link href={`/post/${nextPost.uid}`}>
            <a>
              <h2>{nextPost?.title}</h2>
              <p>Próximo post</p>
            </a>
          </Link>
        )}
      </div>
    </nav>
  );
}
