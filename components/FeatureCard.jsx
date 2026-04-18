import { FaHome, FaBriefcase, FaUser, FaBuilding, FaCheckCircle, FaSearch, FaPercent } from 'react-icons/fa';
import styles from './FeatureCard.module.css';

const iconMap = {
    'home': FaHome,
    'briefcase': FaBriefcase,
    'user': FaUser,
    'building': FaBuilding,
    'check': FaCheckCircle,
    'search': FaSearch,
    'percent': FaPercent,
};

export default function FeatureCard({ icon, title, description, iconName }) {
    const IconComponent = iconName ? iconMap[iconName] : null;

    return (
        <div className={styles.card}>
            <div className={styles.icon}>
                {IconComponent ? <IconComponent /> : icon}
            </div>
            <h4>{title}</h4>
            <p>{description}</p>
        </div>
    );
}
