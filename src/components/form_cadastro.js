import styles from './form_cadastro.module.css'
import { Link } from 'react-router-dom'
import { useState } from 'react';

function FormCadastro() {
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
        try {
            const request = await fetch('http://localhost:5000/cadastrar-dados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datas)
            })

            const result = await request.json()
            console.log(result)
        } catch (erro) {
            console.log(`Erro: ${erro}`)
        }
    }


    const enviar = "CADASTRAR";
    return (
        <div className={styles['box-container']}>
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
        
    )
}

export default FormCadastro;