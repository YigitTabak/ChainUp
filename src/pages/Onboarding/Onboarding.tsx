import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Onboarding.module.css';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, addTask, saveTaskLetter } from '../../firebase/services';
import { Timestamp } from 'firebase/firestore';

type Step = 1 | 2 | 3;

const STEP_COUNT = 3;

const Onboarding = () => {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animating, setAnimating] = useState(false);

  // Step 1 — motivation
  const [motivation, setMotivation] = useState('');

  // Step 2 — task + letter
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDailyGoal, setTaskDailyGoal] = useState('');
  const [taskDuration, setTaskDuration] = useState(30);
  const [letterContent, setLetterContent] = useState('');
  const [showLetterEditor, setShowLetterEditor] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const goTo = (nextStep: Step, dir: 'forward' | 'back') => {
    if (animating) return;
    setDirection(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 300);
  };

  const goNext = () => {
    if (step === 1) {
      if (!motivation.trim()) { setError('Lütfen motivasyonunu yaz.'); return; }
      setError('');
      goTo(2, 'forward');
    } else if (step === 2) {
      if (!taskTitle.trim() || !taskDailyGoal.trim()) {
        setError('Lütfen görev başlığını ve günlük hedefini doldur.');
        return;
      }
      if (!letterContent.trim()) {
        setError('Mektubunu yazmadan devam edemezsin.');
        setShowLetterEditor(true);
        return;
      }
      setError('');
      goTo(3, 'forward');
    }
  };

  const handleTaskFieldChange = () => {
    if (taskTitle.trim() && taskDailyGoal.trim() && !showLetterEditor) {
      setShowLetterEditor(true);
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      const [taskId] = await Promise.all([
        addTask({
          userId: user.uid,
          title: taskTitle.trim(),
          dailyGoal: taskDailyGoal.trim(),
          duration: taskDuration,
          completedRings: 0,
          isCompleted: false,
          order: 0,
          createdAt: Timestamp.now(),
        }),
        updateUserProfile(user.uid, {
          onboardingComplete: true,
          motivation: motivation.trim(),
        }),
      ]);

      await saveTaskLetter(taskId, user.uid, taskTitle.trim(), letterContent.trim());

      await refreshProfile();
      navigate('/dashboard');
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar dene.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(step / STEP_COUNT) * 100}%` }}
        />
      </div>

      <div className={`${styles.slide} ${animating ? (direction === 'forward' ? styles.exitLeft : styles.exitRight) : styles.enter}`}>

        {/* ─── Step 1: Motivation ─── */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <div className={styles.stepBadge}>Adım 1 / {STEP_COUNT}</div>
            <h1 className={styles.stepTitle}>Neden buradasın?</h1>
            <p className={styles.stepDesc}>
              Seni buraya getiren şey nedir? Kendin için bir şeyler değiştirmek mi,
              yeni bir alışkanlık kazanmak mı? Açık ol.
            </p>
            <textarea
              className={styles.textarea}
              placeholder="Örn: Daha disiplinli olmak ve her gün kitap okuma alışkanlığı kazanmak istiyorum…"
              value={motivation}
              onChange={(e) => setMotivation(e.target.value)}
              rows={5}
            />
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.navRow}>
              <button className={styles.nextBtn} onClick={goNext}>
                Devam Et →
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 2: Task + Letter ─── */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <div className={styles.stepBadge}>Adım 2 / {STEP_COUNT}</div>
            <h1 className={styles.stepTitle}>İlk görevini ekle</h1>
            <p className={styles.stepDesc}>
              Ne başarmak istiyorsun, ve her gün ne yapacaksın?
            </p>

            <div className={styles.fields}>
              <div className={styles.field}>
                <label className={styles.label}>Ana Görev</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="örn: Kitabı bitir"
                  value={taskTitle}
                  onChange={(e) => {
                    setTaskTitle(e.target.value);
                    handleTaskFieldChange();
                  }}
                  maxLength={80}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Günlük Hedef</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="örn: Günde 20 sayfa oku"
                  value={taskDailyGoal}
                  onChange={(e) => {
                    setTaskDailyGoal(e.target.value);
                    handleTaskFieldChange();
                  }}
                  maxLength={120}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>
                  Süre — <strong>{taskDuration} gün</strong>
                </label>
                <input
                  type="range"
                  min={1}
                  max={31}
                  value={taskDuration}
                  onChange={(e) => setTaskDuration(Number(e.target.value))}
                  className={styles.slider}
                />
                <div className={styles.sliderLabels}>
                  <span>1 gün</span>
                  <span>31 gün</span>
                </div>
              </div>
            </div>

            {/* Letter editor — appears after task is filled */}
            {showLetterEditor && (
              <div className={styles.letterBox}>
                <div className={styles.letterHeader}>
                  <span className={styles.letterIcon}>✉</span>
                  <div>
                    <p className={styles.letterTitle}>Kendine mektup yaz</p>
                    <p className={styles.letterHint}>
                      Zincirini tamamladığında okunacak. Devam etmeden yazman gerekiyor.
                    </p>
                  </div>
                </div>
                <textarea
                  className={`${styles.textarea} ${styles.letterTextarea}`}
                  placeholder="Sevgili gelecekteki ben, bu görevi seçmemimin sebebi…"
                  value={letterContent}
                  onChange={(e) => setLetterContent(e.target.value)}
                  rows={6}
                />
              </div>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.navRow}>
              <button className={styles.backBtn} onClick={() => goTo(1, 'back')}>
                ← Geri
              </button>
              <button
                className={styles.nextBtn}
                onClick={() => {
                  if (!showLetterEditor) setShowLetterEditor(true);
                  else goNext();
                }}
              >
                Devam Et →
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 3: Confirmation ─── */}
        {step === 3 && (
          <div className={`${styles.stepContent} ${styles.centerStep}`}>
            <div className={styles.celebrationIcon}>⬡</div>
            <h1 className={styles.stepTitle}>Her şey hazır!</h1>
            <p className={styles.stepDesc}>
              Zinciriniz başlıyor. Her gün bir adım at — tutarlılık,
              mükemmellikten daha güçlüdür.
            </p>

            <div className={styles.summaryCard}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Görev</span>
                <span className={styles.summaryValue}>{taskTitle}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Günlük hedef</span>
                <span className={styles.summaryValue}>{taskDailyGoal}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Süre</span>
                <span className={styles.summaryValue}>{taskDuration} gün</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Mektup</span>
                <span className={styles.summaryValueSmall}>Yazıldı — zincir sonunda açılacak 🔒</span>
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.navRow}>
              <button className={styles.backBtn} onClick={() => goTo(2, 'back')}>
                ← Geri
              </button>
              <button
                className={styles.finishBtn}
                onClick={handleFinish}
                disabled={loading}
              >
                {loading ? 'Başlatılıyor…' : 'Zincirime Başla 🔗'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
