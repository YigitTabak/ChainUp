import styles from './Ring.module.css';

interface Props {
  type: 'bright' | 'empty';
  dayNumber?: number;
}

const Ring = ({ type, dayNumber }: Props) => {
  return (
    <div
      className={`${styles.ring} ${styles[type]}`}
      title={dayNumber ? `Halka ${dayNumber}` : undefined}
    >
      {type === 'bright' && <span className={styles.innerGlow} />}
    </div>
  );
};

export default Ring;
