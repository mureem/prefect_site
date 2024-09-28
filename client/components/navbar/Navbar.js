import Image from 'next/image';
//import profileIcon from '../public/profile-icon.png'; // Добавь иконку профиля в папку public
import Link from 'next/link';
import styles from './navbar.module.css'; // Импорт стилей

export default function Navbar() {
    return (
        <nav className={styles.navbar}>
            {/* Логотип слева */}
            <div className={styles.leftSection}>
                <Link href="/main" className={styles.logoLeft}>
                    CABINET TINAO
                </Link>

            {/* Центр навбара: ссылки */}
            <div className={styles.centerSection}>
                <Link href="/objects" className={styles.link}>
                    Объекты
                </Link>
                <Link href="/presentations" className={styles.link}>
                    Презентации
                </Link>
                <Link href="/database" className={styles.link}>
                    База данных ЭДО
                </Link>
                <Link href="/table" className={styles.link}>
                    Таблица
                </Link>
            </div>
            </div>
            {/* Логотип справа и иконка профиля */}
            <div className={styles.rightSection}>
                <a  className={styles.logoRight}>
                    АМВ
                </a>
                <Link href="/profile" className={styles.link}>
                    {/* Здесь можно добавить иконку профиля */}
                    Профиль
                </Link>
            </div>
        </nav>
    );
}
