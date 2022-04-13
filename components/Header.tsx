import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
    return (
        <header className={styles.header}>
            <div className={styles.title}>
                <Link href="/"><a>UniLearn</a></Link>
            </div>
        </header>
    )
}

export default Header
