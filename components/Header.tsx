import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { SessionUser } from '../lib/types';
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
                        {(session.user as SessionUser).role == 'ADMIN' && (
                            <div>
                                <Link href="/admin">
                                    <a>Admin</a>
                                </Link>
                            </div>
                        )}
                        <div>{session.user!.name}</div>
                        <div>
                            <button className={styles.signOutButton} onClick={() => signOut()}>Sign out</button>
                        </div>
                    </>
                )}
            </nav>
        </header>
    )
}

export default Header
