import React, { useMemo } from 'react';
import styles from './Chain.module.css';
import Ring from './Ring';
import { useAppContext } from '../../context/AppContext';
import { buildDisplayRings, getMinCompletedRings } from '../../utils/chainUtils';

const Chain = () => {
  const { activeTasks, tasks, maxTaskDuration } = useAppContext();

  const displayRings = useMemo(
    () => buildDisplayRings(activeTasks, maxTaskDuration),
    [activeTasks, maxTaskDuration]
  );

  const totalBright = getMinCompletedRings(activeTasks);

  if (!tasks.length) {
    return (
      <div className={styles.chainBox}>
        <div className={styles.emptyChain}>
          <p className={styles.emptyText}>Zinciriniz başlamadı — bir görev ekleyerek başla.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chainBox}>
      <div className={styles.header}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{totalBright}</span>
            <span className={styles.statLabel}>tamamlanan halka</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statValue}>{maxTaskDuration - totalBright}</span>
            <span className={styles.statLabel}>kalan halka</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.chainLength}>{maxTaskDuration} halka</span>
          <div className={styles.infoWrap}>
            <span className={styles.infoIcon}>?</span>
            <div className={styles.tooltip}>
              Birden fazla günlük görevin olduğunda halkanın eklenebilmesi için tüm görevlerin tamamlanmış olması gerekmektedir.
            </div>
          </div>
        </div>
      </div>

      <div className={styles.chainScroll}>
        <div className={styles.chainRow}>
          {displayRings.map((slot, i) => (
            <React.Fragment key={slot.day}>
              <Ring
                type={slot.type}
                dayNumber={slot.day}
              />
              {i < displayRings.length - 1 && (
                <div
                  className={`${styles.connector} ${slot.type === 'bright' ? styles.brightConnector : ''}`}
                />
              )}
            </React.Fragment>
          ))}
          {displayRings.length > 0 && (
            <>
              <div className={styles.connector} />
              <div className={styles.finishFlag} title="Bitiş" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chain;
