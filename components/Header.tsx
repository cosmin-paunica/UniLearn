import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './Header.module.css';

const Header = () => {
    const { data: session } = useSession();

    return (
        <header className={styles.header}>
            <div className={styles.leftSide}>
                <Link href="/"><a className={styles.title}>UniLearn</a></Link>
            </div>
            
            <nav className={styles.rightSide}>
                {session?.user && (
                    <>
                        <div>{session.user!.name}</div>
                        <button onClick={() => signOut()}>Sign out</button>
                    </>
                )}
            </nav>
        </header>
    )
}

export default Header
