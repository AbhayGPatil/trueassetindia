import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";
import styles from "./animated-hero.module.css";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Home", "Space", "Identity", "Investment", "Address"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className={styles.heroContainer}>
      <div className={styles.containerMx}>
        <div className={styles.heroContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.mainHeading}>
              <span className={styles.staticText}>Find What Moves You , Your Next</span>
              <span className={styles.dynamicTextWrapper}>
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className={styles.dynamicText}
                    initial={{ opacity: 0, y: "-100px" }}
                    transition={{ type: "spring", stiffness: 50, duration: 0.5 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className={styles.descriptionText}>
              The most valuable assets in Mumbai aren't found on a billboard. They are discovered through strategy. We provide data-driven access to premium bank auctions and distressed luxury assets, turning high-stakes opportunities into your next landmark address
            </p>
            <p className={styles.marathiText}>संधी तुमची, साथ आमची</p>
          </div>

          <div className={styles.buttonGroup}>
            <a href="/auth/signup" className={`${styles.ctaButton} ${styles.primaryButton}`}>
              Sign up here
              <MoveRight className={styles.icon} size={16} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };
