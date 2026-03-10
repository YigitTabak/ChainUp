import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Landing.module.css';
import Navbar from '../../components/Navbar/Navbar';
import { useAuth } from '../../context/AuthContext';

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Görevini belirle',
    desc: 'Ulaşmak istediğin hedefi ve günlük alışkanlığını gir. Kaç gün süreceğini seç.',
    color: 'orange',
  },
  {
    step: '02',
    title: 'Kendine mektup yaz',
    desc: 'Süreci tamamladığında okuyacağın bir mektup yaz. Kendine söz ver.',
    color: 'blue',
  },
  {
    step: '03',
    title: 'Her gün tick işaretle',
    desc: 'Günlük hedefini tamamladında yaklaş ve işaretle. Bir dakika yeter.',
    color: 'green',
  },
  {
    step: '04',
    title: 'Zincirini koru',
    desc: 'Her gece sistem zincire yeni bir halka ekler. Parlak halkalarla zincirinİ dolu tut.',
    color: 'orange',
  },
];

const Landing = () => {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();

  const handleStart = async () => {
    if (user) {
      navigate('/dashboard');
      return;
    }
    try {
      await signInWithGoogle();
    } catch {
      // user cancelled
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />

      {/* ─── Hero ─── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroBadge}>Sadece senin için</div>
          <h1 className={styles.heroTitle}>
            Zincirinizi kırmayın.
            <br />
            <span className={styles.heroAccent}>Her gün bir halka.</span>
          </h1>
          <p className={styles.heroDesc}>
            ChainUp, alışkanlıklarını görsel bir zincire dönüştürür. Rekabet yok, liderboard yok —
            sadece senin ilerlemen ve {' '}
            <strong>sürekliliğin gücü.</strong>
          </p>
          <button className={styles.heroCta} onClick={handleStart}>
            Zincirini Başlat →
          </button>

          {/* Decorative chain preview */}
          <div className={styles.chainPreview}>
            {[...Array(12)].map((_, i) => (
              <React.Fragment key={i}>
                <div
                  className={`${styles.previewRing} ${
                    i < 8 ? styles.previewBright : i < 10 ? styles.previewBroken : styles.previewEmpty
                  }`}
                />
                {i < 11 && (
                  <div className={`${styles.previewConnector} ${i < 8 ? styles.previewConnectorBright : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Background decoration */}
        <div className={styles.heroBg}>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className={styles.howSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionLabel}>Nasıl çalışır?</div>
          <h2 className={styles.sectionTitle}>Dört adımda hayatınızı değiştirin</h2>

          <div className={styles.stepsGrid}>
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className={`${styles.step} ${styles[`step_${item.color}`]}`}>
                <span className={styles.stepNumber}>{item.step}</span>
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Letter Feature ─── */}
      <section className={styles.letterSection}>
        <div className={styles.sectionInner}>
          <div className={styles.letterCard}>
            <div className={styles.letterLeft}>
              <div className={styles.sectionLabel}>Zaman kapsülü</div>
              <h2 className={styles.letterTitle}>Geleceğindeki sana bir mektup</h2>
              <p className={styles.letterDesc}>
                Başlarken kendine söz veriyorsun. Hedefine ulaştığında — zincirin tamamlandığında —
                o mektup açılıyor. Hem gururu hem de yolculuğu aynı anda hissediyorsun.
              </p>
              <button className={styles.heroCta} onClick={handleStart}>
                Başla
              </button>
            </div>
            <div className={styles.letterRight}>
              <div className={styles.paperMock}>
                <div className={styles.paperLines}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className={styles.paperLine} style={{ width: `${70 + (i % 3) * 10}%` }} />
                  ))}
                </div>
                <div className={styles.lockOverlay}>
                  <span className={styles.lockIcon}>🔒</span>
                  <span className={styles.lockLabel}>Tamamlanınca açılır</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className={styles.ctaSection}>
        <div className={styles.sectionInner}>
          <h2 className={styles.ctaTitle}>Bugün başlamak için doğru gün.</h2>
          <p className={styles.ctaDesc}>Zinciriniz sizi bekliyor.</p>
          <button className={styles.heroCta} onClick={handleStart}>
            Ücretsiz Başla →
          </button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className={styles.footer}>
        <span className={styles.footerLogo}>⬡ ChainUp</span>
        <span className={styles.footerTagline}>Zincirinizi kırmayın.</span>
      </footer>
    </div>
  );
};

export default Landing;
