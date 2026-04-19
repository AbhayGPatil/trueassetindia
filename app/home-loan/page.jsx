'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import styles from './page.module.css';

/* ── SVG Icons ── */
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

const BankIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="22" x2="21" y2="22"/>
    <line x1="6" y1="18" x2="6" y2="11"/>
    <line x1="10" y1="18" x2="10" y2="11"/>
    <line x1="14" y1="18" x2="14" y2="11"/>
    <line x1="18" y1="18" x2="18" y2="11"/>
    <polygon points="12 2 20 7 4 7"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

/* ── Banks ── */
const banks = [
  { name: 'SBI Home Loans',      logo: '/home-loan/bank_asset/SBI-Logo.png',  rate: '8.50%', maxLoan: '₹10Cr', tenure: '30 yrs', badge: 'Lowest Rate',  color: '#1a6bb5', url: 'https://homeloans.sbi.bank.in/' },
  { name: 'HDFC Bank',           logo: '/home-loan/bank_asset/hdfc.png',       rate: '8.65%', maxLoan: '₹10Cr', tenure: '30 yrs', badge: 'Most Popular', color: '#004c8f', url: 'https://homeloans.hdfc.bank.in/' },
  { name: 'ICICI Bank',          logo: '/home-loan/bank_asset/icici.jpg',      rate: '8.75%', maxLoan: '₹10Cr', tenure: '30 yrs', badge: null,           color: '#b5261e', url: 'https://www.icici.bank.in/personal-banking/loans/home-loan' },
  { name: 'Kotak Mahindra Bank', logo: '/home-loan/bank_asset/kotak.png',      rate: '8.85%', maxLoan: '₹5Cr',  tenure: '25 yrs', badge: 'Fast Approval',color: '#ED1C24', url: 'https://www.kotak.bank.in/en/personal-banking/loans/home-loan.html' },
  { name: 'Axis Bank',           logo: '/home-loan/bank_asset/axis.png',       rate: '8.90%', maxLoan: '₹5Cr',  tenure: '30 yrs', badge: null,           color: '#97144D', url: 'https://www.axis.bank.in/loans/home-loan' },
  { name: 'Bank of Baroda',      logo: '/home-loan/bank_asset/bob.png',        rate: '8.60%', maxLoan: '₹10Cr', tenure: '30 yrs', badge: null,           color: '#F7A700', url: 'https://bankofbaroda.bank.in/loans/home-loan' },
];

const steps = [
  { icon: '📋', title: 'Check Eligibility',   desc: 'Answer a few quick questions about your income and property to see your loan eligibility instantly.' },
  { icon: '📄', title: 'Submit Documents',     desc: 'Upload KYC, income proof and property documents through our secure digital portal.' },
  { icon: '✅', title: 'Get Pre-Approved',     desc: 'Receive a pre-approval letter within 24 hours to strengthen your purchase offer.' },
  { icon: '🏠', title: 'Disbursal',            desc: 'Loan amount disbursed directly to the seller or builder upon final verification.' },
];

const features = [
  { icon: <BankIcon />,   title: '15+ Partner Banks',       desc: 'Compare offers from top public and private sector banks side by side.' },
  { icon: <ShieldIcon />, title: '100% Secure Process',     desc: 'Bank-grade encryption on all your documents and personal information.' },
  { icon: <ClockIcon />,  title: '24-Hour Pre-Approval',    desc: 'Get a pre-approval letter in as little as 24 hours after document submission.' },
  { icon: <HomeIcon />,   title: 'End-to-End Support',      desc: 'Dedicated loan advisor assigned to guide you from application to disbursement.' },
];

/* ══════════════════════════════════
   MAIN PAGE
══════════════════════════════════ */
export default function HomeLoanPage() {
  const router = useRouter();
  const [loanAmt,  setLoanAmt]  = useState(5000000);
  const [rate,     setRate]     = useState(8.5);
  const [tenure,   setTenure]   = useState(20);
  const [tab,      setTab]      = useState('emi');

  const r = rate / 12 / 100;
  const n = tenure * 12;
  const emi          = loanAmt * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest= totalPayment - loanAmt;
  const principalPct = Math.round((loanAmt / totalPayment) * 100);
  const interestPct  = 100 - principalPct;

  const fmt = (v) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
    if (v >= 100000)   return `₹${(v / 100000).toFixed(1)}L`;
    return `₹${Math.round(v).toLocaleString('en-IN')}`;
  };

  return (
    <div className={styles.page}>

      {/* ── Navbar stub ── */}
      <nav className={styles.navbar}>
        <div className={styles.navInner}>
          <div className={styles.logo} onClick={() => router.push('/')}>
            True<span className={styles.logoAccent}>Assets</span>
            <span className={styles.logoIndia}> India</span>
          </div>
          <button className={styles.backBtn} onClick={() => router.push('/')}>
            ← Back to Home
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <motion.div className={styles.heroText}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className={styles.heroBadge}>TrueAssets Home Loans</span>
            <h1 className={styles.heroTitle}>Get a home on your budget</h1>
            <p className={styles.heroSub}>
              Find a lender who can offer competitive home loan interest rates and
              assist you with pre-approval. Compare from 15+ leading banks and get
              the best deal for your dream home.
            </p>
            <div className={styles.heroBullets}>
              {['Interest rates from 8.5% p.a.', 'Loan amounts up to ₹10 Crore', 'Pre-approval in 24 hours', 'Zero processing fee on select plans'].map(b => (
                <div key={b} className={styles.heroBullet}>
                  <span className={styles.bulletCheck}><CheckIcon /></span>{b}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── EMI Calculator ── */}
      <section className={styles.calcSection}>
        <div className={styles.calcContainer}>
          <div className={styles.calcHeader}>
            <h2 className={styles.calcTitle}>Home Loan EMI Calculator</h2>
            <p className={styles.calcSub}>Move the sliders to calculate your monthly EMI instantly</p>
          </div>

          <div className={styles.calcGrid}>
            {/* Sliders */}
            <div className={styles.slidersCol}>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabelRow}>
                  <span>Loan Amount</span>
                  <span className={styles.sliderVal}>{fmt(loanAmt)}</span>
                </div>
                <input type="range" min="500000" max="100000000" step="500000"
                  value={loanAmt} onChange={e => setLoanAmt(Number(e.target.value))}
                  className={styles.slider} />
                <div className={styles.sliderRange}><span>₹5L</span><span>₹10Cr</span></div>
              </div>

              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabelRow}>
                  <span>Interest Rate</span>
                  <span className={styles.sliderVal}>{rate.toFixed(1)}% p.a.</span>
                </div>
                <input type="range" min="6" max="15" step="0.1"
                  value={rate} onChange={e => setRate(Number(e.target.value))}
                  className={styles.slider} />
                <div className={styles.sliderRange}><span>6%</span><span>15%</span></div>
              </div>

              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabelRow}>
                  <span>Loan Tenure</span>
                  <span className={styles.sliderVal}>{tenure} years</span>
                </div>
                <input type="range" min="1" max="30" step="1"
                  value={tenure} onChange={e => setTenure(Number(e.target.value))}
                  className={styles.slider} />
                <div className={styles.sliderRange}><span>1 yr</span><span>30 yrs</span></div>
              </div>

              {/* Summary row */}
              <div className={styles.summaryRow}>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Total Amount Payable</div>
                  <div className={styles.summaryValue}>{fmt(totalPayment)}</div>
                </div>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Total Interest</div>
                  <div className={styles.summaryValue} style={{ color: '#ef4444' }}>{fmt(totalInterest)}</div>
                </div>
                <div className={styles.summaryItem}>
                  <div className={styles.summaryLabel}>Principal Amount</div>
                  <div className={styles.summaryValue} style={{ color: '#0084FF' }}>{fmt(loanAmt)}</div>
                </div>
              </div>
            </div>

            {/* Result */}
            <div className={styles.resultCol}>
              <div className={styles.emiCard}>
                <div className={styles.emiLabel}>Your Monthly EMI</div>
                <div className={styles.emiValue}>₹{Math.round(emi).toLocaleString('en-IN')}</div>
                <div className={styles.emiDetails}>
                  <div>for {tenure} years at {rate.toFixed(1)}% p.a.</div>
                  <div>on a loan of {fmt(loanAmt)}</div>
                </div>

                {/* Donut chart (CSS-based) */}
                <div className={styles.donutWrapper}>
                  <div className={styles.donut}
                    style={{ background: `conic-gradient(#0084FF 0% ${principalPct}%, #ef4444 ${principalPct}% 100%)` }}>
                    <div className={styles.donutHole} />
                  </div>
                  <div className={styles.donutLegend}>
                    <div className={styles.donutItem}>
                      <span className={styles.donutDot} style={{ background: '#0084FF' }} />
                      <span>Principal {principalPct}%</span>
                    </div>
                    <div className={styles.donutItem}>
                      <span className={styles.donutDot} style={{ background: '#ef4444' }} />
                      <span>Interest {interestPct}%</span>
                    </div>
                  </div>
                </div>

                <button className={styles.applyBtn} onClick={() => router.push('/auth/signup/buyer')}>
                  Get Pre-Approved <ArrowIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Compare Banks ── */}
      <section className={styles.banksSection}>
        <div className={styles.calcContainer}>
          <h2 className={styles.calcTitle}>Compare Home Loan Rates</h2>
          <p className={styles.calcSub}>Updated rates from top banks — as of 2024</p>

          <div className={styles.banksGrid}>
            {banks.map((bank) => (
              <motion.div key={bank.name} className={styles.bankCard}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}>
                {bank.badge && (
                  <span className={styles.bankBadge}>{bank.badge}</span>
                )}
                <div className={styles.bankLogoCircle} style={{ borderColor: bank.color, color: bank.color }}>
                  <img 
                    src={bank.logo} 
                    alt={bank.name} 
                    style={{ objectFit: 'contain', width: '80px', height: '80px' }}
                  />
                </div>
                <div className={styles.bankName}>{bank.name}</div>
                <div className={styles.bankRate}>{bank.rate}</div>
                <div className={styles.bankRateLabel}>p.a. onwards</div>
                <div className={styles.bankDetails}>
                  <span>Up to {bank.maxLoan}</span>
                  <span>·</span>
                  <span>{bank.tenure}</span>
                </div>
                <a href={bank.url} target="_blank" rel="noopener noreferrer" className={styles.bankApplyBtn}>
                  Apply Now
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className={styles.stepsSection}>
        <div className={styles.calcContainer}>
          <h2 className={styles.calcTitle}>How It Works</h2>
          <p className={styles.calcSub}>Get your home loan approved in 4 simple steps</p>
          <div className={styles.stepsGrid}>
            {steps.map((step, i) => (
              <motion.div key={step.title} className={styles.stepCard}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12, duration: 0.45 }}
                viewport={{ once: true }}>
                <div className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepDesc}>{step.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.featuresSection}>
        <div className={styles.calcContainer}>
          <div className={styles.featuresGrid}>
            {features.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <div className={styles.featureTitle}>{f.title}</div>
                <div className={styles.featureDesc}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.calcContainer}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Ready to apply for your home loan?</h2>
            <p className={styles.ctaSub}>Get pre-approved in 24 hours and make a stronger offer on your dream home.</p>
            <div className={styles.ctaBtns}>
              <button className={styles.ctaPrimary} onClick={() => router.push('/auth/signup/buyer')}>
                Apply Now <ArrowIcon />
              </button>
              <button className={styles.ctaSecondary} onClick={() => router.push('/')}>
                Browse Properties
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
