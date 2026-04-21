'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import CinematicHero from '@/components/CinematicHero';
import SearchFilterSection from '@/components/SearchFilterSection';
import FeaturedPropertiesSection from '@/components/FeaturedPropertiesSection';
import CircularGallery from '@/components/CircularGallery';
import FeaturesSection from '@/components/FeaturesSection';
import NotariesSection from '@/components/NotariesSection';
import styles from './luxury-page.module.css';

/* ── Inline SVG Icons (Jugyah-style property feature icons) ── */
const BedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20V10a2 2 0 012-2h16a2 2 0 012 2v10M2 14h20M6 8V5M18 8V5"/>
  </svg>
);

const BathIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-2a6 6 0 016-6h6a6 6 0 016 6v2M3 18h18M7 18v2M17 18v2M9 4a2 2 0 114 0"/>
  </svg>
);

const AreaIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
    <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l.58-.58a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const CalcIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="8" y1="10" x2="10" y2="10"/><line x1="14" y1="10" x2="16" y2="10"/>
    <line x1="8" y1="14" x2="10" y2="14"/><line x1="14" y1="14" x2="16" y2="14"/>
    <line x1="8" y1="18" x2="16" y2="18"/>
  </svg>
);

/* ── Animated number counter ── */
function CountUp({ end, suffix = '', prefix = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    const duration = 2200;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end]);

  return <span ref={ref}>{prefix}{count.toLocaleString('en-IN')}{suffix}</span>;
}

/* ── Mini EMI Calculator widget ── */
function MiniEMICalc() {
  const router = useRouter();
  const [loanAmt, setLoanAmt] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const r = rate / 12 / 100;
  const n = tenure * 12;
  const emi = loanAmt * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);

  const fmt = (v) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(0)}L`;
    return `₹${Math.round(v).toLocaleString('en-IN')}`;
  };

  return (
    <div className={styles.calcCard}>
      <div className={styles.calcHeader}>
        <CalcIcon />
        <span>Quick EMI Calculator</span>
      </div>

      <div className={styles.calcField}>
        <div className={styles.calcLabelRow}>
          <label>Loan Amount</label>
          <span className={styles.calcValue}>{fmt(loanAmt)}</span>
        </div>
        <input type="range" min="1000000" max="50000000" step="500000"
          value={loanAmt} onChange={e => setLoanAmt(Number(e.target.value))}
          className={styles.calcSlider} />
        <div className={styles.calcRange}><span>₹10L</span><span>₹5Cr</span></div>
      </div>

      <div className={styles.calcField}>
        <div className={styles.calcLabelRow}>
          <label>Interest Rate</label>
          <span className={styles.calcValue}>{rate.toFixed(1)}% p.a.</span>
        </div>
        <input type="range" min="6" max="15" step="0.1"
          value={rate} onChange={e => setRate(Number(e.target.value))}
          className={styles.calcSlider} />
        <div className={styles.calcRange}><span>6%</span><span>15%</span></div>
      </div>

      <div className={styles.calcField}>
        <div className={styles.calcLabelRow}>
          <label>Loan Tenure</label>
          <span className={styles.calcValue}>{tenure} years</span>
        </div>
        <input type="range" min="5" max="30" step="1"
          value={tenure} onChange={e => setTenure(Number(e.target.value))}
          className={styles.calcSlider} />
        <div className={styles.calcRange}><span>5 yrs</span><span>30 yrs</span></div>
      </div>

      <div className={styles.emiResult}>
        <div className={styles.emiResultLabel}>Your Monthly EMI</div>
        <div className={styles.emiResultValue}>₹{Math.round(emi).toLocaleString('en-IN')}</div>
        <div className={styles.emiBreakdown}>
          <span>Principal: {fmt(loanAmt)}</span>
          <span>Interest: {fmt(emi * n - loanAmt)}</span>
        </div>
      </div>

      <button className={styles.calcCta} onClick={() => router.push('/home-loan')}>
        Get Pre-Approved &nbsp;<ArrowIcon />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════ */
export default function LuxuryPage() {
  const router = useRouter();
  const [navScrolled, setNavScrolled] = useState(false);
  const [expandedCity, setExpandedCity] = useState('Mumbai');

  /* ── Data ── */
  const stats = [
    { value: 500, suffix: '+',       label: 'Properties Listed'  },
    { value: 1000, suffix: '+',       label: 'Happy Buyers'        },
    { value: 100,  prefix: '₹', suffix: 'Cr+', label: 'Deals Closed' },
    { value: 100,  suffix: '+',       label: 'Verified Agents'     },
  ];

  const propertyTypes = [
    { id: 'apartment',  label: 'Apartment',  count: '100+', },
    { id: 'villa',      label: 'Villa',       count: '10+',  },
    { id: 'plot',       label: 'Plot',        count: '50+',  },
    { id: 'penthouse',  label: 'Penthouse',   count: '50+',   },
    { id: 'commercial', label: 'Commercial',  count: '100+',  },
    { id: 'rowhouse',   label: 'Row House',   count: '100+',    },
  ];

  const marketTrends = [
    { area: 'Worli',      city: 'Mumbai',      trend: '+18%', avgPrice: '₹4.2Cr', properties: 142, barWidth: '72%' },
    { area: 'BKC',        city: 'Mumbai',      trend: '+12%', avgPrice: '₹6.8Cr', properties: 89,  barWidth: '55%' },
    { area: 'Kharghar',   city: 'Navi Mumbai', trend: '+22%', avgPrice: '₹1.1Cr', properties: 310, barWidth: '85%' },
    { area: 'Thane West', city: 'Thane',       trend: '+9%',  avgPrice: '₹1.8Cr', properties: 225, barWidth: '45%' },
  ];

  const rentalAgents = [
    { name: 'Riya Sharma',  specialty: 'Mumbai Rentals',    rating: '4.9', initials: 'RS', color: '#0084FF', deals: '142 deals' },
    { name: 'Arjun Mehta',  specialty: 'Navi Mumbai',       rating: '4.8', initials: 'AM', color: '#059669', deals: '98 deals'  },
    { name: 'Pooja Desai',  specialty: 'Thane & Beyond',    rating: '4.9', initials: 'PD', color: '#7c3aed', deals: '165 deals' },
  ];

  const neighbourhoods = [
    { name: 'Worli',       city: 'Mumbai',      properties: 142, image: '/neighbour1/worli.jpg' },
    { name: 'BKC',         city: 'Mumbai',      properties: 89,  image: '/neighbour1/bkc.png' },
    { name: 'Bandra',      city: 'Mumbai',      properties: 215, image: '/neighbour1/bandra.jpg' },
    { name: 'Juhu',        city: 'Mumbai',      properties: 98,  image: '/neighbour1/juhu.png' },
    { name: 'Kharghar',    city: 'Navi Mumbai', properties: 310, image: '/neighbour1/kharghar.png' },
    { name: 'Thane West',  city: 'Thane',       properties: 225, image: '/neighbour1/THANE WEST.png' },
    { name: 'Lower Parel', city: 'Mumbai',      properties: 178, image: '/neighbour1/lower parel.png' },
    
  ];

  const loanFeatures = [
    'Interest rates from 8.5% p.a.',
    'Loan amounts up to ₹10 Crore',
    'Quick pre-approval in 24 hours',
    '15+ leading banks partnered',
  ];

  const ownerFeatures = [
    { icon: '', title: 'Free Listing',      desc: 'Post unlimited properties at zero cost, forever.' },
    { icon: '', title: 'Quick Verification', desc: 'Your listing goes live within 48 hours of posting.' },
    { icon: '', title: '50K+ Buyers',        desc: 'Reach pre-qualified buyers actively looking now.' },
    { icon: '', title: '24/7 Support',       desc: 'Dedicated agents available anytime you need help.' },
  ];

  const testimonials = [
    { name: 'Rajesh Kumar',  role: 'Homebuyer',         location: '3 BHK in Worli, Mumbai',         text: 'TrueAssets made finding my dream home incredibly easy. The entire process was transparent and completely hassle-free!',    initials: 'RK', color: '#0084FF' },
    { name: 'Priya Singh',   role: 'Tenant',             location: '2 BHK in Kharghar, Navi Mumbai', text: 'Excellent service and professional team. They helped me find the perfect rental property within just a few days.',          initials: 'PS', color: '#7c3aed' },
    { name: 'Amit Patel',    role: 'Property Investor',  location: '5 Properties across Mumbai',     text: "The best real estate platform I've ever used. Verified properties, transparent dealings, and outstanding support!",        initials: 'AP', color: '#059669' },
  ];

  const galleryItems = [
    { image: '/neighbour1/worli.jpg', text: 'Worli' },
    { image: '/neighbour1/lower parel.png', text: 'Lower Parel' },
    { image: '/neighbour1/bandra.jpg', text: 'Bandra' },
    { image: '/neighbour2/mulund1.jpg', text: 'Mulund' },
    { image: '/neighbour1/juhu.png', text: 'Juhu' },
    { image: '/neighbour2/pali.png', text: 'Pali Hill' },
    { image: '/neighbour1/bkc.png', text: 'BKC' },
    { image: '/neighbour1/kharghar.png', text: 'Kharghar' },
    { image: '/neighbour2/Kalyan.jpg', text: 'Kalyan' },
    { image: '/neighbour1/THANE WEST.png', text: 'Thane West' },
  ];

  const locationsByCity = {
    Mumbai: [
      'Andheri West', 'Andheri East', 'Marol', 'Powai', 'Mahim', 'Kurla', 'BKC', 'Ghatkopar East',
      'Mira Road', 'Bhayandar', 'Worli', 'Matunga East', 'Mulund', 'Bhandup', 'Ghatkopar West',
      'Sion', 'Vile Parle West', 'Juhu', 'Jogeshwari East', 'Jogeshwari West', 'Goregaon West',
      'Borivali East', 'Borivali West', 'Dahisar', 'Malabar Hill', 'Colaba', 'Haware City',
      'Tardeo', 'Byculla', 'Kanjurmarg', 'Mahalaxmi', 'Grant Road',
    ],
    Thane: [
      'Thane East', 'Beyond Thane', 'Korum Mall', 'Majiwada', 'Kolshet', 'Manpada', 'Hiranandani Estate',
      'Suraj Water Park', 'Waghbil', 'Anand Nagar', 'Ghodbunder Road', 'Thane West', 'Dombivali',
    ],
    'Navi Mumbai': [
      'Panvel', 'Airoli', 'Ghansoli', 'Navi Mumbai', 'Kharghar', 'Taloja', 'Koperkhairane', 'Rabale',
      'Turbhe', 'Vashi', 'Sanpada', 'Juinagar', 'Nerul', 'Seawood Darave', 'Belapur CBD', 'Mansaoravar',
      'Khandeshwar', 'Bamandongri', 'Kharkopar', 'Diva', 'Ulwe', 'Shilphata',
    ],
  };

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 36);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>

      {/* ══ TOP BAR ══ */}
      <div className={styles.topBar}>
        <div className={styles.topBarInner}>
          <div className={styles.topBarLeft}>
            <span><PhoneIcon /> +91 98765 43210</span>
            <span>✉ contact@trueassets.in</span>
          </div>
          <div className={styles.topBarRight}>
            <span>🔒 100% Verified Listings</span>
            <span className={styles.topBarCta}>⚡ Post Property FREE</span>
          </div>
        </div>
      </div>

      {/* ══ NAVBAR ══ */}
      <nav className={`${styles.navbar} ${navScrolled ? styles.scrolled : ''}`}>
        <div className={styles.navContent}>
          <div className={styles.logo} onClick={() => router.push('/')}>
            <span className={styles.logoText}>True<span className={styles.logoAccent}>Assets</span></span>
            <span className={styles.logoTag}>India</span>
          </div>

          <div className={styles.navLinks}>
            <a href="#featured">Buy</a>
            <a href="#featured">Rent</a>
            <a href="#featured">New Projects</a>
            <a href="#featured">Commercial</a>
            <a href="/home-loan">Home Loans</a>
          </div>

          <div className={styles.navActions}>
            <button onClick={() => router.push('/auth/signup/owner')} className={styles.postFreeBtn}>+ Post FREE</button>
            <button onClick={() => router.push('/auth/login')} className={styles.signInBtn}>Sign In</button>
            <button onClick={() => router.push('/auth/signup/buyer')} className={styles.signUpBtn}>Register</button>
          </div>
        </div>
      </nav>

      {/* ══ CINEMATIC HERO — UNTOUCHED ══ */}
      <CinematicHero />

      {/* ══ STATS STRIP ══ */}
      <section className={styles.statsStrip}>
        <div className={styles.statsInner}>
          {stats.map((stat, i) => (
            <motion.div key={i} className={styles.statItem}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}>
              <div className={styles.statValue}>
                <CountUp end={stat.value} suffix={stat.suffix} prefix={stat.prefix || ''} />
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ SEARCH & FILTER — UNTOUCHED ══ */}
      <SearchFilterSection />

      {/* ══ BROWSE BY TYPE ══ */}
      <section className={styles.browseTypeSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionEyebrow}>Explore by Category</span>
            <h2 className={styles.sectionTitle}>What Are You Looking For?</h2>
          </div>
          <div className={styles.typesGrid}>
            {propertyTypes.map((type, i) => (
              <motion.button key={type.id} className={styles.typeCard}
                onClick={() => router.push(`/listings?type=${type.id}`)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}>
                <span className={styles.typeIcon}>{type.icon}</span>
                <span className={styles.typeLabel}>{type.label}</span>
                <span className={styles.typeCount}>{type.count} listings</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURED PROPERTIES — UNTOUCHED ══ */}
      <div id="featured">
        <FeaturedPropertiesSection />
      </div>

      {/* ══════════════════════════════════════════
          JUGYAH SECTION 1: JUST LOOKING TO RENT?
      ══════════════════════════════════════════ */}
      <section className={styles.rentSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.rentGrid}>
            {/* Left – image column */}
            <motion.div className={styles.rentImageCol}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}>
              <div className={styles.rentImgWrapper}>
                <img
                  src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=720&h=600&fit=crop"
                  alt="Premium rental apartment"
                  className={styles.rentImg}
                />
                {/* Floating stat card */}
                <div className={styles.rentFloatCard}>
                  <div className={styles.rentFloatIcon}>🏠</div>
                  <div>
                    <div className={styles.rentFloatTitle}>2,400+ Rental Listings</div>
                    <div className={styles.rentFloatSub}>Across Mumbai &amp; Navi Mumbai</div>
                  </div>
                </div>
                {/* Feature badges */}
                <div className={styles.rentBadge} style={{ top: '20px', left: '20px' }}>
                  <BedIcon /> 2–4 BHK
                </div>
                <div className={styles.rentBadge} style={{ top: '20px', right: '20px' }}>
                  <AreaIcon /> 600–2400 sq.ft
                </div>
              </div>
            </motion.div>

            {/* Right – text column */}
            <motion.div className={styles.rentTextCol}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              viewport={{ once: true }}>
              <span className={styles.sectionEyebrow}>For Renters</span>
              <h2 className={styles.rentTitle}>Just looking to rent?</h2>
              <p className={styles.rentBody}>
                We can help you find your next home. Work with our dedicated rental agents to
                discover exclusive listings tailored for you — verified properties, zero brokerage options.
              </p>

              {/* Agent cards */}
              <div className={styles.agentList}>
                {rentalAgents.map((agent) => (
                  <div key={agent.name} className={styles.agentCard}>
                    <div className={styles.agentAvatar} style={{ background: agent.color }}>
                      {agent.initials}
                    </div>
                    <div className={styles.agentInfo}>
                      <div className={styles.agentName}>{agent.name}</div>
                      <div className={styles.agentSpecialty}>{agent.specialty} · {agent.deals}</div>
                    </div>
                    <div className={styles.agentRating}>⭐ {agent.rating}</div>
                  </div>
                ))}
              </div>

              <div className={styles.rentBtns}>
                <button className={styles.rentBtnPrimary} onClick={() => router.push('/listings?type=rent')}>
                  Browse Rentals <ArrowIcon />
                </button>
                <button className={styles.rentBtnSecondary} onClick={() => router.push('/auth/signup/buyer')}>
                  <PhoneIcon /> Talk to an Agent
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          JUGYAH SECTION 2: HOME LOANS
      ══════════════════════════════════════════ */}
      <section className={styles.homeLoanSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.homeLoanGrid}>
            {/* Left – text */}
            <motion.div className={styles.homeLoanText}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}>
              <span className={styles.sectionEyebrow}>Home Loans</span>
              <h2 className={styles.homeLoanTitle}>
                Get a home on your budget with<br />TrueAssets Home Loans
              </h2>
              <p className={styles.homeLoanBody}>
                Find a lender who can offer competitive home loan interest rates
                and assist you with pre-approval. Compare from 15+ leading banks
                and get the best deal.
              </p>

              <div className={styles.loanFeatures}>
                {loanFeatures.map((f) => (
                  <div key={f} className={styles.loanFeatureItem}>
                    <span className={styles.loanCheckIcon}><CheckIcon /></span>
                    {f}
                  </div>
                ))}
              </div>

              <div className={styles.loanBtns}>
                <button className={styles.loanBtnPrimary} onClick={() => router.push('/home-loan')}>
                  Calculate EMI <ArrowIcon />
                </button>
                <button className={styles.loanBtnSecondary} onClick={() => router.push('/home-loan')}>
                  View All Lenders
                </button>
              </div>
            </motion.div>

            {/* Right – calculator */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              viewport={{ once: true }}>
              <MiniEMICalc />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ MARKET INSIGHTS ══ */}
      <section className={styles.insightsSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.insightsHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Live Market Data</span>
              <h2 className={styles.sectionTitle}>Price Trends — What&apos;s Moving</h2>
            </div>
            <button className={styles.viewAllTrends} onClick={() => router.push('/listings')}>
              View All Trends →
            </button>
          </div>
          <div className={styles.trendsGrid}>
            {marketTrends.map((trend, i) => (
              <motion.div key={trend.area} className={styles.trendCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                onClick={() => router.push(`/listings?location=${trend.area}`)}>
                <div className={styles.trendTop}>
                  <div>
                    <div className={styles.trendArea}>{trend.area}</div>
                    <div className={styles.trendCity}>{trend.city}</div>
                  </div>
                  <div className={styles.trendBadge}>↑ {trend.trend}</div>
                </div>
                <div className={styles.trendBar}>
                  <motion.div className={styles.trendBarFill}
                    initial={{ width: 0 }}
                    whileInView={{ width: trend.barWidth }}
                    transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
                    viewport={{ once: true }} />
                </div>
                <div className={styles.trendBottom}>
                  <span className={styles.trendPrice}>Avg {trend.avgPrice}</span>
                  <span className={styles.trendCount}>{trend.properties} properties</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES SECTION — UNTOUCHED ══ */}
      <FeaturesSection />

      {/* ══════════════════════════════════════════
          JUGYAH SECTION 3: POPULAR NEIGHBOURHOODS (image grid)
      ══════════════════════════════════════════ */}
      <section className={styles.neighbourhoodSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionEyebrow}>Explore by Location</span>
            <h2 className={styles.sectionTitle}>Popular Neighbourhoods</h2>
            <p className={styles.sectionSubtitle}>
              Discover premium properties in Mumbai&apos;s most sought-after locations
            </p>
          </div>
          <div className={styles.neighbourhoodGrid}>
            {neighbourhoods.map((n, i) => (
              <motion.div key={n.name} className={styles.neighbourhoodCard}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07, duration: 0.45 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                onClick={() => router.push(`/listings?location=${n.name}`)}>
                <img src={n.image} alt={n.name} className={styles.neighbourhoodImg} />
                <div className={styles.neighbourhoodOverlay} />
                <div className={styles.neighbourhoodInfo}>
                  <div className={styles.neighbourhoodName}>{n.name}</div>
                  <div className={styles.neighbourhoodMeta}>{n.city} · {n.properties} properties</div>
                </div>
                <div className={styles.neighbourhoodArrow}><ArrowIcon /></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ POPULAR NEIGHBORHOODS CIRCULAR GALLERY — UNTOUCHED ══ */}
      <section id="neighborhoods" className={styles.circularGallerySection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionEyebrowLight}>Discover Mumbai</span>
            <h2 className={styles.sectionTitleLight}>The Real Home of Premium Properties.
            </h2>
            <p className={styles.sectionSubtitleLight}>
              Find homes in Mumbai&apos;s most sought-after locations
            </p>
          </div>
        </div>
        <div style={{ height: '600px', position: 'relative' }}>
          <CircularGallery items={galleryItems} bend={3} textColor="#ffffff"
            borderRadius={0.05} scrollSpeed={1.9} scrollEase={0.05} />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          JUGYAH SECTION 4: SELL OR RENT QUICKLY
      ══════════════════════════════════════════ */}
      <section className={styles.ownersSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.ownersGrid}>
            {/* Left – text */}
            <motion.div className={styles.ownersLeft}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}>
              <span className={styles.sectionEyebrow}>For Property Owners</span>
              <h2 className={styles.ownersTitle}>
                Sell or Rent your property quickly at TrueAssets
              </h2>
              <p className={styles.ownersBody}>
                Easily sell or rent your property with TrueAssets. Our platform ensures fast,
                hassle-free transactions, connecting you with the right buyers or tenants in no time.
              </p>

              <div className={styles.ownerFeatureGrid}>
                {ownerFeatures.map((f) => (
                  <div key={f.title} className={styles.ownerFeatureItem}>
                    <span className={styles.ownerFeatureIcon}>{f.icon}</span>
                    <div>
                      <div className={styles.ownerFeatureTitle}>{f.title}</div>
                      <div className={styles.ownerFeatureDesc}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.ownersBtns}>
                <button className={styles.listHomeBtn} onClick={() => router.push('/auth/signup/owner')}>
                  List your home <ArrowIcon />
                </button>
                <button className={styles.learnMoreBtn} onClick={() => router.push('/auth/login')}>
                  Learn more
                </button>
              </div>
            </motion.div>

            {/* Right – property image */}
            <motion.div className={styles.ownersRight}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}>
              <div className={styles.ownersImgWrapper}>
                <img
                  src="https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=640&h=560&fit=crop"
                  alt="Premium property"
                  className={styles.ownersImg}
                />
                {/* Floating stat chips */}
                <div className={styles.ownerFloatChip} style={{ top: '24px', left: '-20px' }}>
                  <span className={styles.ownerChipVal}>₹0</span>
                  <span className={styles.ownerChipLbl}>Listing Fee</span>
                </div>
                <div className={styles.ownerFloatChip} style={{ bottom: '80px', right: '-20px' }}>
                  <span className={styles.ownerChipVal}>48hr</span>
                  <span className={styles.ownerChipLbl}>Verification</span>
                </div>
                <div className={styles.ownerFloatChip} style={{ bottom: '24px', left: '24px' }}>
                  <span className={styles.ownerChipVal}>50K+</span>
                  <span className={styles.ownerChipLbl}>Active Buyers</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ FLATS FOR SALE BY LOCATION ══ */}
      <section className={styles.locationsSection}>
        <div className={styles.sectionContainer}>
          <h2 className={styles.sectionTitleSerif}>Flats for Sale by Location</h2>
          <p className={styles.locationsSubtitle}>Discover premium properties in your preferred neighborhood</p>

          {/* Minimalist Underline Tabs */}
          <div className={styles.cityTabsMinimal}>
            {Object.keys(locationsByCity).map((city) => (
              <button key={city}
                className={`${styles.cityTabMinimal} ${expandedCity === city ? styles.cityTabMinimalActive : ''}`}
                onClick={() => setExpandedCity(expandedCity === city ? '' : city)}>
                {city}
              </button>
            ))}
          </div>

          {/* Clean Location Grid */}
          {expandedCity && (
            <motion.div key={expandedCity} className={styles.locationsGridClean}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}>
              {locationsByCity[expandedCity].slice(0, 16).map((location) => (
                <button key={location} className={styles.locationLinkClean}
                  onClick={() => router.push(`/listings?location=${encodeURIComponent(location)}`)}>
                  <span className={styles.locationNameClean}>{location}</span>
                  <span className={styles.locationCountClean}>(Luxury Homes)</span>
                </button>
              ))}
              {locationsByCity[expandedCity].length > 16 && (
                <button className={styles.showMoreLinkClean}
                  onClick={() => router.push(`/listings?city=${encodeURIComponent(expandedCity)}`)}>
                  <span>+{locationsByCity[expandedCity].length - 16} more locations</span>
                  <span className={styles.arrow}>→</span>
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section className={styles.testimonialsSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeading}>
            <span className={styles.sectionEyebrow}>Customer Stories</span>
            <h2 className={styles.sectionTitle}>What Our Clients Say</h2>
            <p className={styles.sectionSubtitle}>Join 50,000+ satisfied customers across India</p>
          </div>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <motion.div key={t.name} className={styles.testimonialCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                viewport={{ once: true }}>
                <div className={styles.quoteIcon}>&ldquo;</div>
                <p className={styles.testimonialText}>{t.text}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.testimonialAvatar} style={{ background: t.color }}>{t.initials}</div>
                  <div className={styles.testimonialInfo}>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialRole}>{t.role}</div>
                    <div className={styles.testimonialLocation}>📍 {t.location}</div>
                  </div>
                  <div className={styles.verifiedBadge}>✓ Verified</div>
                </div>
                <div className={styles.testimonialStars}>★★★★★</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NOTARIES SECTION ══ */}
      <NotariesSection />

      {/* ══ CTA ══ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}>
            <div className={styles.ctaEyebrow}>India&apos;s Most Trusted Real Estate Platform</div>
            <h2 className={styles.ctaTitle}>Ready to Find Your Perfect Home?</h2>
            <p className={styles.ctaSubtitle}>15,000+ verified properties across Mumbai, Thane &amp; Navi Mumbai</p>
            <div className={styles.ctaBtns}>
              <button onClick={() => router.push('/listings')} className={styles.ctaBtnPrimary}>Explore Properties →</button>
              <button onClick={() => router.push('/auth/signup/owner')} className={styles.ctaBtnOutline}>Post Property FREE</button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          JUGYAH-STYLE FOOTER
      ══════════════════════════════════════════ */}
      <footer className={styles.footer}>
        <div className={styles.footerMain}>
          <div className={styles.sectionContainer}>
            <div className={styles.footerGrid}>
              {/* Brand column */}
              <div className={styles.footerBrand}>
                <div className={styles.footerLogo}>
                  True<span className={styles.footerLogoAccent}>Assets</span>
                  <span className={styles.footerLogoIndia}> India</span>
                </div>
                <p className={styles.footerTagline}>
                  India&apos;s fastest growing verified real estate platform. Connecting buyers,
                  sellers and brokers since 2024.
                </p>
                <div className={styles.footerContact}>
                  <div className={styles.footerContactItem}><PhoneIcon /> +91 98765 43210</div>
                  <div className={styles.footerContactItem}>✉ contact@trueassets.in</div>
                </div>
                <div className={styles.footerSocials}>
                  {['in', 'fb', 'tw', 'yt'].map((s) => (
                    <a key={s} href="#" className={styles.socialBtn}>{s}</a>
                  ))}
                </div>
              </div>

              {/* Explore column */}
              <div className={styles.footerCol}>
                <h5 className={styles.footerColTitle}>Explore</h5>
                <a href="/listings" className={styles.footerLink}>Buy Property</a>
                <a href="/listings?type=rent" className={styles.footerLink}>Rent Property</a>
                <a href="/listings" className={styles.footerLink}>New Projects</a>
                <a href="/listings" className={styles.footerLink}>Commercial</a>
                <a href="/listings" className={styles.footerLink}>Bank Auction</a>
                <a href="/home-loan" className={styles.footerLink}>Home Loans</a>
              </div>

              {/* Cities column */}
              <div className={styles.footerCol}>
                <h5 className={styles.footerColTitle}>Top Cities</h5>
                <a href="/listings?city=Mumbai" className={styles.footerLink}>Mumbai</a>
                <a href="/listings?city=Thane" className={styles.footerLink}>Thane</a>
                <a href="/listings?city=Navi%20Mumbai" className={styles.footerLink}>Navi Mumbai</a>
                <a href="/listings?location=Worli" className={styles.footerLink}>Worli</a>
                <a href="/listings?location=BKC" className={styles.footerLink}>BKC</a>
                <a href="/listings?location=Bandra" className={styles.footerLink}>Bandra</a>
              </div>

              {/* Company column */}
              <div className={styles.footerCol}>
                <h5 className={styles.footerColTitle}>Company</h5>
                <a href="#" className={styles.footerLink}>About Us</a>
                <a href="#" className={styles.footerLink}>Careers</a>
                <a href="#" className={styles.footerLink}>Blog</a>
                <a href="#" className={styles.footerLink}>Press</a>
                <a href="#" className={styles.footerLink}>Contact Us</a>
                <button className={styles.footerPostBtn}
                  onClick={() => router.push('/auth/signup/owner')}>
                  Post Property FREE
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div className={styles.footerBottom}>
          <div className={styles.sectionContainer}>
            <div className={styles.footerBottomInner}>
              <p>© 2024 TrueAssets India Pvt. Ltd. All rights reserved.</p>
              <div className={styles.footerBottomLinks}>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Use</a>
                <a href="#">Cookie Policy</a>
                <span className={styles.sslBadge}>🔒 256-bit SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
