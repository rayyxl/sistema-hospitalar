import styles from './tela_inicial.module.css'
import { useEffect, useRef } from 'react'

function TelaInicial() {

    const text_ref = useRef(null)

    
    useEffect(() => {
        const fetchData = async () => {
          try {
            const request = await fetch('http://localhost:5000/retornar-medico', {
              method: 'GET',
              credentials: 'include'  // ADICIONE ISSO
            });
            
            const result = await request.json();
    
            if (result.mensagem) {
              text_ref.current.innerText = `Seja bem-vindo(a), Dr(a) ${result.dados.nome}.`;
            }
          } catch (erro) {
            console.log('erro:', erro);
          }
        };
    
        fetchData();
      }, []);
    

    return (
        <>
            <p ref={text_ref}></p>
        </>
        
    )
}

export default TelaInicial;