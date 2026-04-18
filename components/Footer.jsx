import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.footerContent}>
                    <div className={styles.footerSection}>
                        <h4>TrueAsset</h4>
                        <p>Your trusted partner in finding the perfect property. Connect with verified agents and discover your dream home today.</p>
                        <div className={styles.socialIcons}>
                            <a href="#" className={styles.socialIcon} aria-label="Facebook">
                                <FaFacebook />
                            </a>
                            <a href="#" className={styles.socialIcon} aria-label="Twitter">
                                <FaTwitter />
                            </a>
                            <a href="#" className={styles.socialIcon} aria-label="Instagram">
                                <FaInstagram />
                            </a>
                            <a href="#" className={styles.socialIcon} aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>Explore</h4>
                        <Link href="/listings">Buy Property</Link>
                        <Link href="/listings">Rent Property</Link>
                        <Link href="/listings">Bank Auction</Link>
                        <Link href="/broker">Find Brokers</Link>
                        <Link href="/developer">For Developers</Link>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>Company</h4>
                        <Link href="/about">About Us</Link>
                        <Link href="/contact">Contact Us</Link>
                        <Link href="/inquiry">Community</Link>
                        <Link href="#">Careers</Link>
                        <Link href="#">Blog</Link>
                    </div>

                    <div className={styles.footerSection}>
                        <h4>Support</h4>
                        <Link href="#">Help Center</Link>
                        <Link href="#">Privacy Policy</Link>
                        <Link href="#">Terms of Service</Link>
                        <Link href="#">FAQs</Link>
                        <Link href="/contact">Get in Touch</Link>
                    </div>
                </div>

                <div className={styles.footerBottom}>
                    <p>© 2025 TrueAsset. All rights reserved.</p>
                    <p>Designed with ❤️ for our clients</p>
                </div>
            </div>
        </footer>
    );
}
