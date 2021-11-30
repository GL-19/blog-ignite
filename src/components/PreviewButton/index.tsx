import styles from './styles.module.scss';

export function PreviewButton(): JSX.Element {
  return (
    <button className={styles.container} type="button">
      Sair do preview
    </button>
  );
}
