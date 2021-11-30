import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import styles from './styles.module.scss';

interface PostInfoProps {
  createdAt: string;
  author: string;
  readingTime?: string;
}

export function PostInfo({
  createdAt,
  author,
  readingTime,
}: PostInfoProps): JSX.Element {
  return (
    <div className={styles.container}>
      <p>
        <FiCalendar />
        {createdAt}
      </p>
      <p>
        <FiUser />
        {author}
      </p>
      {readingTime && (
        <p>
          <FiClock />
          {readingTime}
        </p>
      )}
    </div>
  );
}
