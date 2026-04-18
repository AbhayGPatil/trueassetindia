'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
    const router = useRouter();
    const [scrolled, setScrolled] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const buyCategories = {
        "Popular Choices": [
            "Ready to Move",
            "Owner Properties",
            "Budget Homes",
            "Premium Homes",
            "New Projects"
        ],
        "Property Types": [
            "Flats",
            "Houses",
            "Villas",
            "Plots",
            "Office Space",
            "Commercial Space"
        ],
        "Budget": [
            "Under ₹ 50 L",
            "₹ 50 L - ₹ 1 Cr",
            "₹ 1 Cr - ₹ 1.5 Cr",
            "Above ₹ 1.5 Cr"
        ],
        "Explore": [
            "Localities",
            "Projects",
            "Find an Agent",
            "Home Interiors"
        ]
    };

    const rentCategories = {
        "Popular Choices": [
            "Verified Properties",
            "Bachelor Friendly",
            "Furnished Homes",
            "Immediately Available",
            "Owner Properties"
        ],
        "Property Types": [
            "Flat for Rent",
            "House for Rent",
            "Villa for Rent",
            "PG in Bangalore",
            "Co-Living Space",
            "Office Space"
        ],
        "Budget": [
            "Under ₹ 10,000",
            "₹ 10,000 - ₹ 15,000",
            "₹ 15,000 - ₹ 25,000",
            "Above ₹ 25,000"
        ],
        "Explore": [
            "Localities",
            "Buy Vs Rent",
            "Find an Agent",
            "Share Requirement",
            "Rent Agreement",
            "Property Services"
        ]
    };

    const commercialCategories = {
        "Commercial Resale": [
            "Commercial Space",
            "Office Space",
            "Retail Space",
            "Industrial Space",
            "Co-working Space"
        ],
        "Commercial Rent": [
            "Office for Rent",
            "Commercial Space Rent",
            "Retail Space Rent",
            "Industrial Space Rent",
            "Co-working Rent"
        ],
        "Explore": [
            "Bank Auctions",
            "Commercial Projects",
            "Find Broker",
            "Commercial Insights",
            "Trade Licenses"
        ]
    };

    const MegaMenu = ({ categories }) => (
        <div className={styles.megaMenu}>
            <div className={styles.megaMenuContent}>
                {Object.entries(categories).map(([category, items]) => (
                    <div key={category} className={styles.megaColumn}>
                        <h4>{category}</h4>
                        <ul>
                            {items.map((item) => (
                                <li key={item}>
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        router.push(`/listings?search=${encodeURIComponent(item)}`);
                                        setActiveMenu(null);
                                    }}>
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
            <div className={styles.navContainer}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    TRUEASSETS
                </Link>

                {/* Desktop Menu */}
                <div className={styles.desktopMenu}>
                    {/* Buy Dropdown */}
                    <div 
                        className={styles.menuItem}
                        onMouseEnter={() => setActiveMenu('buy')}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button className={styles.menuButton}>
                            Buy
                            <svg className={styles.chevron} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeMenu === 'buy' && <MegaMenu categories={buyCategories} />}
                    </div>

                    {/* Rent Dropdown */}
                    <div 
                        className={styles.menuItem}
                        onMouseEnter={() => setActiveMenu('rent')}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button className={styles.menuButton}>
                            Rent
                            <svg className={styles.chevron} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeMenu === 'rent' && <MegaMenu categories={rentCategories} />}
                    </div>

                    {/* Commercial Dropdown */}
                    <div 
                        className={styles.menuItem}
                        onMouseEnter={() => setActiveMenu('commercial')}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <button className={styles.menuButton}>
                            Commercial
                            <svg className={styles.chevron} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeMenu === 'commercial' && <MegaMenu categories={commercialCategories} />}
                    </div>

                    {/* Simple Links */}
                    <Link href="/" className={styles.navLink}>Advice</Link>
                    <Link href="/" className={styles.navLink}>Help</Link>
                </div>

                {/* Right Actions */}
                <div className={styles.navActions}>
                    <Link href="/auth/login" className={styles.loginBtn}>
                        Login
                    </Link>
                    <Link href="/auth/signup/buyer" className={styles.signUpBtn}>
                        Sign Up
                    </Link>
                    <Link href="/auth/signup/owner" className={styles.postPropertyBtn}>
                        Post Property <span className={styles.badge}>FREE</span>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={styles.mobileToggle}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className={styles.mobileMenu}>
                    {/* Buy Section */}
                    <div className={styles.mobileMenuSection}>
                        <button
                            className={styles.mobileMenuItem}
                            onClick={() => setActiveMenu(activeMenu === 'buy' ? null : 'buy')}
                        >
                            <span>Buy</span>
                            <svg className={`${styles.chevronMobile} ${activeMenu === 'buy' ? styles.rotated : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeMenu === 'buy' && (
                            <div className={styles.mobileSubmenu}>
                                {Object.entries(buyCategories).map(([category, items]) => (
                                    <div key={category} className={styles.submenuCategory}>
                                        <p className={styles.categoryTitle}>{category}</p>
                                        {items.map(item => (
                                            <a key={item} href="#" onClick={(e) => {
                                                e.preventDefault();
                                                router.push(`/listings?search=${encodeURIComponent(item)}`);
                                                setMobileMenuOpen(false);
                                            }}>
                                                {item}
                                            </a>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Rent Section */}
                    <div className={styles.mobileMenuSection}>
                        <button
                            className={styles.mobileMenuItem}
                            onClick={() => setActiveMenu(activeMenu === 'rent' ? null : 'rent')}
                        >
                            <span>Rent</span>
                            <svg className={`${styles.chevronMobile} ${activeMenu === 'rent' ? styles.rotated : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeMenu === 'rent' && (
                            <div className={styles.mobileSubmenu}>
                                {Object.entries(rentCategories).map(([category, items]) => (
                                    <div key={category} className={styles.submenuCategory}>
                                        <p className={styles.categoryTitle}>{category}</p>
                                        {items.map(item => (
                                            <a key={item} href="#" onClick={(e) => {
                                                e.preventDefault();
                                                router.push(`/listings?search=${encodeURIComponent(item)}`);
                                                setMobileMenuOpen(false);
                                            }}>
                                                {item}
                                            </a>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Commercial Section */}
                    <div className={styles.mobileMenuSection}>
                        <button
                            className={styles.mobileMenuItem}
                            onClick={() => setActiveMenu(activeMenu === 'commercial' ? null : 'commercial')}
                        >
                            <span>Commercial</span>
                            <svg className={`${styles.chevronMobile} ${activeMenu === 'commercial' ? styles.rotated : ''}`} viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {activeMenu === 'commercial' && (
                            <div className={styles.mobileSubmenu}>
                                {Object.entries(commercialCategories).map(([category, items]) => (
                                    <div key={category} className={styles.submenuCategory}>
                                        <p className={styles.categoryTitle}>{category}</p>
                                        {items.map(item => (
                                            <a key={item} href="#" onClick={(e) => {
                                                e.preventDefault();
                                                router.push(`/listings?search=${encodeURIComponent(item)}`);
                                                setMobileMenuOpen(false);
                                            }}>
                                                {item}
                                            </a>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Simple Links */}
                    <Link href="/" className={styles.mobileLink}>Advice</Link>
                    <Link href="/" className={styles.mobileLink}>Help</Link>
                </div>
            )}
        </nav>
    );
}
