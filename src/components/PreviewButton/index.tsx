import Link from 'next/link';
import styles from './styles.module.scss';

interface PreviewButtonProps {
  exit_url: string;
}

export function PreviewButton({ exit_url }: PreviewButtonProps): JSX.Element {
  return (
    <Link href={exit_url}>
      <a>
        <button className={styles.container} type="button">
          Sair do preview
        </button>
      </a>
    </Link>
  );
}
