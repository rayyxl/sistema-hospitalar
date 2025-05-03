import styles from './form_login.module.css'
import { Link } from 'react-router-dom'

function FormLogin() {
    const enviar = "ENTRAR";
    return (
        <div className={styles['box-container']}>
            <div className={styles['box-titulo']}>
                <h1>LOGIN</h1>
            </div>
            <form>
                <div className='box-email'>
                    <label htmlFor="crm">CRM:</label>
                    <input type="text" name="crm" id="crm"/>
                </div>
                <div className='box-senha'>
                    <label htmlFor="senha">SENHA:</label>
                    <input type="password" name="senha" id="senha" />
                </div>
                <div className={styles['box-button']}>
                    <input type='submit' value={enviar} name='button' id='button'/>
                </div>
            
            </form>
            <div className={styles['box-cadastro']}>
                <Link to="/form-cadastro" className={styles['link']}>SIGN UP</Link>
                <Link to="/" className={styles['link']}>ESQUECEU A SENHA?</Link>
            </div>
        </div>
        
    )
}

export default FormLogin;