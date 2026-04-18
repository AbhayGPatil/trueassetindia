'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import styles from './landing.module.css';

export default function LandingPage() {
  const router = useRouter();
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState({
    location: '',
    propertyType: 'sell',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    loadFeaturedProperties();
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      setLoading(true);
      // Try without strict filters first to diagnose permissions issue
      const q = query(
        collection(db, 'properties'),
        limit(6)
      );
      const querySnapshot = await getDocs(q);
      const props = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeaturedProperties(props);
    } catch (err) {
      console.error('Error loading featured properties:', err);
      // Fallback: try to load with status filter
      try {
        const q = query(
          collection(db, 'properties'),
          where('status', '==', 'active'),
          limit(6)
        );
        const querySnapshot = await getDocs(q);
        const props = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFeaturedProperties(props);
      } catch (err2) {
        console.error('Second attempt failed:', err2);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to listings with search params
    const params = new URLSearchParams();
    if (searchInput.location) params.append('location', searchInput.location);
    if (searchInput.propertyType) params.append('type', searchInput.propertyType);
    if (searchInput.minPrice) params.append('minPrice', searchInput.minPrice);
    if (searchInput.maxPrice) params.append('maxPrice', searchInput.maxPrice);
    
    router.push(`/listings?${params.toString()}`);
  };

  const handleViewMore = () => {
    // Redirect to signup/login - they'll choose their role
    router.push('/auth/signup');
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    }
    return `₹${price}`;
  };

  return (
    <div className={styles.container}>
      {/* HEADER/NAVBAR */}
      <header className={styles.navbar}>
        <div className={styles.navbar_content}>
          <div className={styles.logo}>
            <h1>🏠 TrueAssets India</h1>
          </div>
          <div className={styles.nav_buttons}>
            <button 
              className={styles.btn_login}
              onClick={() => router.push('/auth/login')}
            >
              Login
            </button>
            <button 
              className={styles.btn_signup}
              onClick={() => router.push('/auth/signup')}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.hero_overlay}></div>
        <div className={styles.hero_content}>
          <h2 className={styles.hero_title}>
            Find Your Perfect Property in India
          </h2>
          <p className={styles.hero_subtitle}>
            Explore lakhs of properties for sale, rent, and investment. Get the best deals from verified sellers.
          </p>

          {/* SEARCH BOX */}
          <form className={styles.search_box} onSubmit={handleSearch}>
            <div className={styles.search_input_group}>
              <div className={styles.search_field}>
                <label>Location</label>
                <input
                  type="text"
                  placeholder="Enter city, locality, or project..."
                  value={searchInput.location}
                  onChange={(e) => setSearchInput({...searchInput, location: e.target.value})}
                />
              </div>

              <div className={styles.search_field}>
                <label>Property Type</label>
                <select
                  value={searchInput.propertyType}
                  onChange={(e) => setSearchInput({...searchInput, propertyType: e.target.value})}
                >
                  <option value="sell">Buy</option>
                  <option value="rent">Rent</option>
                  <option value="lease">Lease</option>
                </select>
              </div>

              <div className={styles.search_field}>
                <label>Budget (Min)</label>
                <input
                  type="number"
                  placeholder="₹ Min price"
                  value={searchInput.minPrice}
                  onChange={(e) => setSearchInput({...searchInput, minPrice: e.target.value})}
                />
              </div>

              <div className={styles.search_field}>
                <label>Budget (Max)</label>
                <input
                  type="number"
                  placeholder="₹ Max price"
                  value={searchInput.maxPrice}
                  onChange={(e) => setSearchInput({...searchInput, maxPrice: e.target.value})}
                />
              </div>

              <button type="submit" className={styles.search_btn}>
                🔍 Search
              </button>
            </div>
          </form>

          {/* QUICK CATEGORY PILLS */}
          <div className={styles.quick_categories}>
            <button className={styles.category_pill}>🏢 Commercial</button>
            <button className={styles.category_pill}>🏠 Residential</button>
            <button className={styles.category_pill}>📍 Plot/Land</button>
            <button className={styles.category_pill}>🏗️ New Projects</button>
            <button className={styles.category_pill}>🔨 Auction</button>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES SECTION */}
      <section className={styles.featured_section}>
        <div className={styles.section_header}>
          <h2>Featured Properties</h2>
          <p>Explore top properties listed on TrueAssets</p>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading featured properties...</div>
        ) : featuredProperties.length > 0 ? (
          <>
            <div className={styles.properties_grid}>
              {featuredProperties.map((property) => (
                <div key={property.id} className={styles.property_card}>
                  {/* Property Image */}
                  <div className={styles.property_image}>
                    {property.images && property.images.length > 0 ? (
                      <img 
                        src={property.images[0]} 
                        alt={property.title}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Property+Image'}
                      />
                    ) : (
                      <div className={styles.no_image}>No Image Available</div>
                    )}
                    {/* Type Badge */}
                    <span className={styles.type_badge}>
                      {property.type === 'sell' ? '🏷️ For Sale' : '🔑 For Rent'}
                    </span>
                  </div>

                  {/* Property Info */}
                  <div className={styles.property_info}>
                    <h3 className={styles.property_title}>{property.title}</h3>
                    
                    <p className={styles.property_location}>
                      📍 {property.location}
                    </p>

                    <div className={styles.property_specs}>
                      <span className={styles.spec}>
                        🛏️ {property.bedrooms || '-'} BHK
                      </span>
                      <span className={styles.spec}>
                        🚿 {property.bathrooms || '-'} Bath
                      </span>
                      <span className={styles.spec}>
                        📐 {property.area || '-'} sqft
                      </span>
                    </div>

                    <div className={styles.property_footer}>
                      <div className={styles.price}>
                        <strong>{formatPrice(property.price)}</strong>
                        {property.type === 'rent' && <span>/month</span>}
                      </div>
                      <button 
                        className={styles.view_btn}
                        onClick={() => router.push(`/property/${property.id}`)}
                      >
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* VIEW MORE BUTTON */}
            <div className={styles.view_more_container}>
              <button className={styles.view_more_btn} onClick={handleViewMore}>
                ✨ Explore All Properties - Sign Up Now ✨
              </button>
            </div>
          </>
        ) : (
          <div className={styles.no_properties}>
            <p>No featured properties available yet. Check back soon!</p>
            <button className={styles.view_more_btn} onClick={handleViewMore}>
              Create Account & List Your Property
            </button>
          </div>
        )}
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className={styles.why_section}>
        <div className={styles.section_header}>
          <h2>Why Choose TrueAssets?</h2>
        </div>

        <div className={styles.features_grid}>
          <div className={styles.feature_card}>
            <div className={styles.feature_icon}>🔒</div>
            <h3>100% Safe & Verified</h3>
            <p>All properties and sellers verified. Secure transactions with buyer protection.</p>
          </div>

          <div className={styles.feature_card}>
            <div className={styles.feature_icon}>📱</div>
            <h3>Easy to Use</h3>
            <p>Search, compare, and shortlist properties in seconds with advanced filters.</p>
          </div>

          <div className={styles.feature_card}>
            <div className={styles.feature_icon}>💰</div>
            <h3>Best Deals</h3>
            <p>Find properties at the best prices directly from owners and verified brokers.</p>
          </div>

          <div className={styles.feature_card}>
            <div className={styles.feature_icon}>👨‍💼</div>
            <h3>Expert Support</h3>
            <p>24/7 customer support to help you throughout your property journey.</p>
          </div>

          <div className={styles.feature_card}>
            <div className={styles.feature_icon}>📊</div>
            <h3>Real-time Updates</h3>
            <p>Get instant notifications for new properties matching your requirements.</p>
          </div>

          <div className={styles.feature_card}>
            <div className={styles.feature_icon}>🌍</div>
            <h3>Pan-India Coverage</h3>
            <p>Search properties across all major cities and tier-2/tier-3 markets in India.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className={styles.how_it_works}>
        <div className={styles.section_header}>
          <h2>How It Works</h2>
        </div>

        <div className={styles.steps_container}>
          <div className={styles.step}>
            <div className={styles.step_number}>1</div>
            <h4>Sign Up</h4>
            <p>Create your account as a buyer, owner, or broker in seconds.</p>
          </div>

          <div className={styles.step_arrow}>→</div>

          <div className={styles.step}>
            <div className={styles.step_number}>2</div>
            <h4>Search & Filter</h4>
            <p>Use powerful filters to find properties matching your needs.</p>
          </div>

          <div className={styles.step_arrow}>→</div>

          <div className={styles.step}>
            <div className={styles.step_number}>3</div>
            <h4>Connect</h4>
            <p>Contact sellers directly or schedule property visits.</p>
          </div>

          <div className={styles.step_arrow}>→</div>

          <div className={styles.step}>
            <div className={styles.step_number}>4</div>
            <h4>Transact</h4>
            <p>Complete your transaction securely with our support.</p>
          </div>
        </div>
      </section>

      {/* PRICING PLANS SECTION */}
      <section className={styles.pricing_section}>
        <div className={styles.section_header}>
          <h2>Affordable Plans for Everyone</h2>
          <p>Unlock unlimited listings and premium features</p>
        </div>

        <div className={styles.pricing_grid}>
          <div className={styles.pricing_card}>
            <h3>Free</h3>
            <p className={styles.price_tag}>₹0</p>
            <ul className={styles.features_list}>
              <li>✓ Browse all properties</li>
              <li>✓ Save favorites</li>
              <li>✓ Contact sellers</li>
              <li>✗ Post 0 listings</li>
            </ul>
            <button className={styles.pricing_btn_secondary}>Get Started</button>
          </div>

          <div className={styles.pricing_card + ' ' + styles.pricing_card_popular}>
            <div className={styles.popular_badge}>💎 MOST POPULAR</div>
            <h3>ProLister</h3>
            <p className={styles.price_tag}>₹1,500<span>/3 months</span></p>
            <ul className={styles.features_list}>
              <li>✓ Browse all properties</li>
              <li>✓ Unlimited listings</li>
              <li>✓ Featured listings</li>
              <li>✓ Analytics dashboard</li>
              <li>✓ Priority support</li>
            </ul>
            <button className={styles.pricing_btn_primary}>Subscribe Now</button>
          </div>

          <div className={styles.pricing_card}>
            <h3>RentMaster</h3>
            <p className={styles.price_tag}>₹500<span>/1 month</span></p>
            <ul className={styles.features_list}>
              <li>✓ Browse all properties</li>
              <li>✓ Unlimited listings</li>
              <li>✓ Quick results</li>
              <li>✓ Popular for rentals</li>
            </ul>
            <button className={styles.pricing_btn_secondary}>Subscribe Now</button>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.cta_section}>
        <h2>Ready to Find Your Dream Property?</h2>
        <p>Join thousands of buyers, sellers, and brokers on TrueAssets today!</p>
        <div className={styles.cta_buttons}>
          <button 
            className={styles.cta_btn_primary}
            onClick={() => router.push('/auth/signup')}
          >
            Sign Up Now - It's Free! 🚀
          </button>
          <button 
            className={styles.cta_btn_secondary}
            onClick={() => router.push('/listings')}
          >
            Browse Properties →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footer_content}>
          <div className={styles.footer_section}>
            <h4>About TrueAssets</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#partner">Become a Partner</a></li>
            </ul>
          </div>

          <div className={styles.footer_section}>
            <h4>For Buyers</h4>
            <ul>
              <li><a href="#search">Search Properties</a></li>
              <li><a href="#guides">Buying Guides</a></li>
              <li><a href="#trends">Market Trends</a></li>
              <li><a href="#mortage">Mortgage Help</a></li>
            </ul>
          </div>

          <div className={styles.footer_section}>
            <h4>For Sellers</h4>
            <ul>
              <li><a href="#list">List Property</a></li>
              <li><a href="#pricing">Pricing Plans</a></li>
              <li><a href="#support">Support</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          <div className={styles.footer_section}>
            <h4>Contact Us</h4>
            <ul>
              <li>📧 support@trueassets.in</li>
              <li>📱 1800-TRUEASSETS</li>
              <li>🏢 New Delhi, India</li>
            </ul>
          </div>
        </div>

        <div className={styles.footer_bottom}>
          <p>&copy; 2026 TrueAssets India. All rights reserved.</p>
          <div className={styles.footer_links}>
            <a href="#terms">Terms & Conditions</a>
            <a href="#privacy">Privacy Policy</a>
            <a href="#disclaimer">Disclaimer</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
