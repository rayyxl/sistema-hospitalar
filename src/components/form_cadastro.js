import styles from './form_cadastro.module.css'
import { useNavigate, Link } from 'react-router-dom'
import { useRef, useState } from 'react'
import { gsap } from 'gsap'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

function FormCadastro() {

    // DECLARATIONS
    const [datas, setDatas] = useState({
        nome: '',
        senha: '',
        cpf: '',
        especializacao: '',
        uf: '',
        crm: ''
    })

    const especialidades_medicas = [
        "CARDIOLOGIA",
        "NUTRICIONISTA",
        "DERMATOLOGIA",
        "PEDIATRIA",
        "ORTOPEDIA",
        "GINECOLOGIA",
        "NEUROLOGIA",
        "PSIQUIATRIA",
        "OFTALMOLOGIA",
        "ENDOCRINOLOGIA",
        "ONCOLOGIA",
        "OUTRA ESPECIALIDADE"
    ]; 

    const estados = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
        "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
        "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ];

    const navigate = useNavigate();

    const box_cadastro_ref = useRef(null)
    const box_alert_ref = useRef(null)
    const text_alert_ref = useRef(null)
    const button_corrigir_ref = useRef(null)
    const button_confirmar_ref = useRef(null)
    const cpf_input_ref = useRef(null) 


    // FUNCTIONS
    function generate_crm(uf) {
        let crm_gerado = ""
        for(let i = 0; i < 6; i++) {
            let random_number = Math.floor(Math.random() * 10)
            crm_gerado += random_number.toString()
        }
        return `${crm_gerado}/CRM-${uf}`
    }

    const formatar_cpf = (valor) => {
        valor = valor.replace(/\D/g, "")
    
        if (valor.length <= 11) {
          valor = valor
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
        }
    
        return valor
    };


    function handle_input(e) {
        const { name, value } = e.target;

        if (name === "uf") {
            setDatas({
                ...datas,
                uf: value,
                crm: generate_crm(value),
            });
        } else if (name === "cpf") {
            const valor_formatado = formatar_cpf(value)
            setDatas({
                ...datas,
                cpf: valor_formatado
            })
        } else {
            // Outros campos apenas atualizam normalmente
            setDatas({
            ...datas,
            [name]: value
            });
        }
    }

    async function handle_submit(e) {
        e.preventDefault()

        if (validarSenha(datas.senha)) {
            try {
                const request = await fetch('http://localhost:5000/cadastrar-medico', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datas)
                })
    
                const result = await request.json()

                NProgress.start()

                if (!result.erro_crm && !result.erro_cpf) {

                    abrir_box_alerta()

                    text_alert_ref.current.innerText = `NOME: ${datas.nome},\nCRM: ${datas.crm},\nCPF: ${datas.cpf}.`

                    gsap.to(button_corrigir_ref.current, {display: 'none', duration: 0.1})

                    gsap.to(button_confirmar_ref.current, {display: 'block', duration: 0.1})

                } else if (result.erro_crm && result.erro_cpf) {
                    NProgress.done()

                    abrir_box_alerta()

                    text_alert_ref.current.innerText = `CPF JÁ CADASTRADO E O CRM GERADO ESTÁ EM CONFLITO.`

                } else if (result.erro_crm) {
                    NProgress.done()

                    abrir_box_alerta()

                    text_alert_ref.current.innerText = `CONFLITO COM O CRM! SERÁ GERADO OUTRO.`

                } else if (result.erro_cpf) {
                    NProgress.done()

                    text_alert_ref.current.innerText = `CPF JÁ CADASTRADO NO SISTEMA!`

                    setDatas({
                        ...datas,
                        crm: generate_crm(datas.uf)
                    });

                }
                
                  
            } catch (erro) {
                console.log(`Erro: ${erro}`)
            }
        } else {
            abrir_box_alerta()

            text_alert_ref.current.innerText = 'A SENHA DEVE TER NO MÍN. 8 CARACTERES,\nLETRAS MAIÚSCULAS, NÚMEROS, CARACTERES ESPECIAIS\nE SEM ESPAÇOS EM BRANCO!'
        }
    }

    const ir_pagina_login = () => {
        NProgress.done()
        navigate('/')
    };

    function abrir_box_alerta() {
        gsap.to(box_cadastro_ref.current, {opacity: 0, display: 'none', duration: 0.5})

        gsap.to(box_alert_ref.current, {opacity: 1, display: 'flex', duration: 1})
    }

    function fechar_box_alert() {

        gsap.to(box_alert_ref.current, {opacity: 0, display: 'none', duration: 0.5})

        gsap.to(box_cadastro_ref.current, {opacity: 1, display: 'flex', duration: 1})
    }

    function validarSenha(senha) {
        const tamanho_minimo = senha.length >= 8;
        const tem_letra_maiu = /[A-Z]/.test(senha);
        const tem_letra_minu = /[a-z]/.test(senha)
        const tem_numero = /[0-9]/.test(senha);
        const tem_especial = /[!@#$%^&*(),.?":{}|<>_\-+=\\[\]~`]/.test(senha);
        const tem_espaco = /\s/.test(senha)
      
        return tamanho_minimo && tem_letra_maiu && tem_letra_minu && tem_numero && tem_especial && !tem_espaco;
    }


    return (
        <div className={styles['box-page-cadastro']}>
            <div className={styles['box-container']}>
                <div ref={box_cadastro_ref} className={styles['box-cadastro']}>
                    <div className={styles['box-titulo']}>
                        <h1>CADASTRO DO MÉDICO</h1>
                    </div>
                    <form onSubmit={handle_submit}>
                        <div className='box-crm'>
                            <label htmlFor="nome">NOME COMPLETO:</label>
                            <input type="text" name="nome" value={datas.nome} id="nome" onChange={handle_input} required />
                        </div>

                        <div className='box-senha'>
                            <label htmlFor="senha">SENHA:</label>
                            <input type="password" name="senha" value={datas.senha} id="senha" onChange={handle_input} required />
                        </div>

                        <div className='box-cpf'>
                            <label htmlFor="cpf">CPF:</label>
                            <input type='text' ref={cpf_input_ref} id='cpf' name='cpf' value={datas.cpf} onChange={handle_input} maxLength="14" required/>
                        </div>

                        <div className='box-especializacao'>
                            <label htmlFor="especializacao">ESPECIALIZAÇÃO:</label>
                            <select name='especializacao' onChange={handle_input} value={datas.especializacao} required>
                                <option value="" disabled selected></option>
                                {especialidades_medicas.map((esp) => (
            <option value={esp}>{esp}</option>
        ))}
                            </select>
                        </div>

                        <div className='box-uf'>
                            <label htmlFor="uf">UF:</label>
                            <select name='uf' onChange={handle_input} value={datas.uf} required>
                                <option value="" disabled selected></option>
                                {estados.map((est) => (
            <option value={est}>{est}</option>
        ))}
                            </select>
                        </div>

                        <div className='box-text-crm'>
                            <label htmlFor='text-crm'>CRM GERADO:</label>
                            <div className={styles['campo-crm']}>
                                <p>{datas.crm}</p>
                            </div>
                        </div>

                        <div className={styles['box-button']}>
                            <input type='submit' value="CADASTRAR" name='button' id='button'/>
                        </div>
                    </form>
                    <div className={styles['box-cadastro']}>
                        <Link to="/" className={styles['link']}>VOLTAR</Link>
                    </div>
                </div>
                <div ref={box_alert_ref} className={styles['box-alert']}>
                    <h1>ATENÇÃO!</h1>

                    <p ref={text_alert_ref}></p>

                    <button ref={button_corrigir_ref} type='button' onClick={fechar_box_alert}>CORRIGIR</button>

                    <button className={styles['button-seguir']} ref={button_confirmar_ref} type='button' onClick={ir_pagina_login}>SEGUIR</button>
                </div>
            </div>
        </div>
        
    )
}

export default FormCadastro;