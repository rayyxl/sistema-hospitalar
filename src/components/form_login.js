import styles from './form_login.module.css'
import { useNavigate, Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

function FormLogin() {

    //DECLARATIONS
    const [datas, setDatas] = useState({
        crm: '',
        senha: ''
    })

    const text_alert_ref = useRef(null)
    const box_alert_ref = useRef(null)

    const navigate = useNavigate()

    //FUNCTIONS
    function handle_input(e) {
        setDatas({
            ...datas,
            [e.target.name]: e.target.value
        })
    }

    async function handle_submit(e) {
            e.preventDefault()
    
          
            try {
                const request = await fetch('http://localhost:5000/logar-medico', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datas),
                    credentials: "include"
                })

                NProgress.start()
    
                const result = await request.json()


                if (!result.erro_crm && !result.erro_senha) {

                    NProgress.done()

                    navigate('/tela-inicial')

                } else if (result.erro_crm && result.erro_senha) {
                    NProgress.done()

                    abrir_box_alerta()

                    text_alert_ref.current.innerText = `DADOS NÃO CADASTRADOS NO SISTEMA!`

                } else if (result.erro_senha) {
                    NProgress.done()

                    abrir_box_alerta()

                    text_alert_ref.current.innerText = `SENHA INCORRETA!`

                }
                    
            } catch (erro) {
                console.log(`Erro: ${erro}`)
            }
        }

        function abrir_box_alerta() {
            gsap.to(box_alert_ref.current, {opacity: 1, display: 'flex', duration: 1.1})

            setTimeout(() => {
                gsap.to(box_alert_ref.current, {opacity: 0, display: 'none', duration: 0.6})
            }, 2500)
        }
    
    return (
        <div className={styles['box-page-login']}>
            <div className={styles['box-container']}>
                <div className={styles['box-titulo']}>
                    <h1>LOGIN</h1>
                </div>
                <form onSubmit={handle_submit}>
                    <div className='box-crm'>
                        <label htmlFor="crm">CRM:</label>
                        <input type="text" name="crm" id="crm" value={datas.crm} onChange={handle_input} required/>
                    </div>

                    <div className='box-senha'>
                        <label htmlFor="senha">SENHA:</label>
                        <input type="password" name="senha" id="senha" value={datas.senha} onChange={handle_input} required/>
                    </div>
                    <div ref={box_alert_ref} className={styles['box-text-alert']}>
                        <p ref={text_alert_ref}></p>
                    </div>
                    <div className={styles['box-button']}>
                        <input type='submit' value="ENTRAR" name='button' id='button'/>
                    </div>
                
                </form>
                <div className={styles['box-cadastro']}>
                    <Link to="/form-cadastro" className={styles['link']}>SIGN UP</Link>
                    <Link to="/" className={styles['link']}>ESQUECEU A SENHA?</Link>
                </div>
            </div>
        </div>
        
    )
}

export default FormLogin;