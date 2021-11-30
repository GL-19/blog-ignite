import { FiUser, FiCalendar, FiClock } from 'react-icons/fi';
import styles from './styles.module.scss';

interface InfoProps {
  createdAt: string;
  author: string;
  readingTime?: string;
}

export function Info({
  createdAt,
  author,
  readingTime,
}: InfoProps): JSX.Element {
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
