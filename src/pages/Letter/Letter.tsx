import { useState } from 'react';
import styles from './Letter.module.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useAppContext } from '../../context/AppContext';

const Letter = () => {
  const { letters, deleteLetter } = useAppContext();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.main}>
        <div className={styles.center}>
          {letters.length === 0 ? (
            <div className={styles.noLetter}>
              <p>Henüz bir mektup yok. Görev eklerken mektubunu yazacaksın.</p>
            </div>
          ) : (
            <div className={styles.letterList}>
              {letters.map((letter) => {
                const isUnlocked = letter.isUnlocked === true;
                return (
                  <div
                    key={letter.taskId}
                    className={`${styles.paperWrap} ${isUnlocked ? styles.unlocked : ''}`}
                  >
                    <div className={styles.paper}>
                      <div className={styles.paperTop}>
                        <div className={styles.paperTopLeft}>
                          <span className={styles.paperLabel}>Kendine mektup</span>
                          <span className={styles.taskName}>{letter.taskTitle}</span>
                        </div>
                        <div className={styles.paperTopRight}>
                          {isUnlocked && letter.unlockedAt && (
                            <span className={styles.unlockedBadge}>✦ Açıldı</span>
                          )}
                          {isUnlocked && (
                            confirmDelete === letter.taskId ? (
                              <div className={styles.confirmRow}>
                                <span className={styles.confirmText}>Silinsin mi?</span>
                                <button
                                  className={styles.confirmYes}
                                  onClick={() => { deleteLetter(letter.taskId); setConfirmDelete(null); }}
                                >
                                  Evet
                                </button>
                                <button
                                  className={styles.confirmNo}
                                  onClick={() => setConfirmDelete(null)}
                                >
                                  Hayır
                                </button>
                              </div>
                            ) : (
                              <button
                                className={styles.deleteBtn}
                                onClick={() => setConfirmDelete(letter.taskId)}
                                aria-label="Mektubu sil"
                              >
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                  <path d="M10 11v6" />
                                  <path d="M14 11v6" />
                                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                </svg>
                              </button>
                            )
                          )}
                        </div>
                      </div>

                      {isUnlocked ? (
                        <div className={styles.content}>
                          <p className={styles.letterText}>{letter.content}</p>
                        </div>
                      ) : (
                        <div className={styles.lockedContent}>
                          <div className={styles.blurredLines}>
                            {[...Array(8)].map((_, i) => (
                              <div
                                key={i}
                                className={styles.blurLine}
                                style={{ width: `${60 + (i % 4) * 10}%` }}
                              />
                            ))}
                          </div>
                          <div className={styles.lockOverlay}>
                            <span className={styles.lockIcon}>🔒</span>
                            <p className={styles.lockTitle}>Mektubun seni bekliyor</p>
                            <p className={styles.lockDesc}>
                              Bu görevi tamamladığında mektup açılır.
                              <br />
                              Zincirini koru ve devam et.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Letter;
