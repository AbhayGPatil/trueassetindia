import Image from 'next/image';
import styles from './TestimonialCard.module.css';

export default function TestimonialCard({ name, role, avatar, rating, text }) {
    return (
        <div className={styles.card}>
            <Image
                src={avatar}
                alt={name}
                width={80}
                height={80}
                className={styles.avatar}
            />
            <div className={styles.stars}>
                {'⭐'.repeat(rating)}
            </div>
            <p className={styles.text}>"{text}"</p>
            <h5 className={styles.author}>{name}</h5>
            <p className={styles.role}>{role}</p>
        </div>
    );
}
