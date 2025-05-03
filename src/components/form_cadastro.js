import styles from './form_cadastro.module.css'
import { useNavigate, Link } from 'react-router-dom'
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

function FormCadastro() {

    // DECLARAÇÕES
    const [datas, setDatas] = useState({
        nome: '',
        senha: '',
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
        "OUTRA"
    ]; 

    const estados = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
        "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
        "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
    ];

    const navigate = useNavigate();

    const box_cadastro_ref = useRef(null)
    const box_erro_ref = useRef(null)
    const text_erro_ref = useRef(null)
    const button_corrigir_ref = useRef(null)
    const button_confirmar_ref = useRef(null)


    // FUNÇÕES
    function generate_crm(uf) {
        let crm_gerado = ""
        for(let i = 0; i < 6; i++) {
            let random_number = Math.floor(Math.random() * 10)
            crm_gerado += random_number.toString()
        }
        return `${crm_gerado}/CRM-${uf}`
    }


    function handle_input(e) {
        const { name, value } = e.target;

        // Se o campo for UF, atualize UF e gere o CRM na sequência
        if (name === "uf") {
            setDatas({
                ...datas,
                uf: value,
                crm: generate_crm(value),
            });
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
                const request = await fetch('http://localhost:5000/cadastrar-dados', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(datas)
                })
    
                const result = await request.json()

                if (result) {
                    gsap.to(box_cadastro_ref.current, {opacity: 0, display: 'none', duration: 1})

                    gsap.to(box_erro_ref.current, {opacity: 1, display: 'flex', duration: 1})

                    text_erro_ref.current.innerText = `NOME: ${datas.nome},\nCRM: ${datas.crm}\nESPECIALIZAÇÃO: ${datas.especializacao}.`

                    gsap.to(button_corrigir_ref.current, {display: 'none', duration: 0.1})

                    gsap.to(button_confirmar_ref.current, {display: 'block', duration: 0.1})
                }
                
                  
            } catch (erro) {
                console.log(`Erro: ${erro}`)
            }
        } else {
            gsap.to(box_cadastro_ref.current, {opacity: 0, display: 'none', duration: 0.5})

            gsap.to(box_erro_ref.current, {opacity: 1, display: 'flex', duration: 1})

            text_erro_ref.current.innerText = 'A SENHA DEVE TER NO MÍN. 8 CARACTERES,\nLETRAS MAIÚSCULAS, NÚMEROS, CARACTERES ESPECIAIS\nE SEM ESPAÇOS EM BRANCO!'
        }
    }

    const pagina_login = () => {
        navigate('/')
    };

    function fechar_box_erro() {

        gsap.to(box_erro_ref.current, {opacity: 0, display: 'none', duration: 0.5})

        gsap.to(box_cadastro_ref.current, {opacity: 1, display: 'flex', duration: 1})
    }

    function validarSenha(senha) {
        const tamanho_minimo = senha.length >= 8;
        const tem_letra_maiu = /[A-Z]/.test(senha);
        const tem_letra_minu = /[a-z]/.test(senha)
        const tem_numero = /[0-9]/.test(senha);
        const tem_especial = /[!@#$%^&*(),.?":{}|<>_\-+=\\[\]\/~`]/.test(senha);
        const tem_espaco = /\s/.test(senha)
      
        return tamanho_minimo && tem_letra_maiu && tem_letra_minu && tem_numero && tem_especial && !tem_espaco;
    }


    const enviar = "CADASTRAR";
    return (
        <div className={styles['box-container']}>
            <div ref={box_cadastro_ref} className={styles['box-cadastro']}>
                <div className={styles['box-titulo']}>
                    <h1>LOGIN</h1>
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

                    <div className='box-especializacao'>
                        <label htmlFor="especializacao">ESPECIALIZAÇÃO:</label>
                        <select name='especializacao' onChange={handle_input} value={datas.especializacao} required>
                            <option value="" disabled></option>
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
                        <input type='submit' value={enviar} name='button' id='button'/>
                    </div>
                </form>
                <div className={styles['box-cadastro']}>
                    <Link to="/" className={styles['link']}>VOLTAR</Link>
                </div>
            </div>
            <div ref={box_erro_ref} className={styles['box-erro']}>
                <h1>ATENÇÃO!</h1>

                <p ref={text_erro_ref}></p>

                <button ref={button_corrigir_ref} type='button' onClick={fechar_box_erro}>CORRIGIR</button>

                <button className={styles['button-seguir']} ref={button_confirmar_ref} type='button' onClick={pagina_login}>SEGUIR</button>
            </div>
        </div>
        
    )
}

export default FormCadastro;