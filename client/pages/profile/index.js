import Navbar from '../../components/navbar/Navbar';
import styles from './profile.module.css';

export default function Profile() {
    return (
        <div>
            <Navbar />
            <div className={styles.content}>
                <form className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="firstName" className={styles.label}>Имя:</label>
                        <input type="text" id="firstName" name="firstName" className={styles.input}/>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="lastName" className={styles.label}>Фамилия:</label>
                        <input type="text" id="lastName" name="lastName" className={styles.input}/>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Электронная почта:</label>
                        <input type="email" id="email" name="email" className={styles.input}/>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="profilePhoto" className={styles.label}>Фото профиля:</label>
                        <input type="file" id="profilePhoto" name="profilePhoto" className={styles.inputFile}/>
                    </div>
                    <button type="submit" className={styles.saveButton}>Сохранить изменения</button>
                    <button className={styles.editButton}>Редактировать профиль</button>
                </form>

            </div>
        </div>
    );
}
