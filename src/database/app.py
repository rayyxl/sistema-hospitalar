import os
from flask import Flask, jsonify, request, session
from flask_cors import CORS
import pymysql

# Inicializa o flask
app = Flask(__name__)
app.secret_key = 'raisoares123'

# o flask aceitará requisições de outros domínios
CORS(app, supports_credentials=True)


# Limpar o terminal (válido apenas no windows)
os.system('cls')


# Classe feita para a manipulação do BD
class BD:
    def __init__(self):
        # Referenciando o BD
        self.conexao = pymysql.connect(
            host='localhost',
            user='root',
            password='',
            database='database_logins'
        )

    def verificar_crm_medico(self, dados):

        try:
            with self.conexao.cursor() as cursor:
                sql = "SELECT * FROM dados_login WHERE crm = %s"

                dado_verificador = (dados['crm'],)

                cursor.execute(sql, dado_verificador)

                resultado = cursor.fetchone()

                if (resultado):
                    return resultado
                return False


        except Exception as e:
            print('Erro:', e)
            return False
        
    def verificar_cpf_medico(self, dados):

        try:
            with self.conexao.cursor() as cursor:
                sql = "SELECT * FROM dados_login WHERE cpf = %s"

                dado_verificador = (dados['cpf'],)

                cursor.execute(sql, dado_verificador)

                resultado = cursor.fetchone()

                if (resultado):
                    return resultado
                return False


        except Exception as e:
            print('Erro:', e)
            return False


    def adicionar_medico(self, dados):

        try:
            with self.conexao.cursor() as cursor:

                if (not self.verificar_cpf_medico(dados) and not self.verificar_crm_medico(dados)):

                    sql = "INSERT INTO dados_login (nome, senha, cpf, uf, crm) VALUES (%s, %s, %s, %s, %s)"

                    valores = (dados['nome'], dados['senha'], dados['cpf'], dados['uf'], dados['crm'])   

                    cursor.execute(sql, valores)

                    self.conexao.commit()
                    return True
                
                return False

        except Exception as e:
            print('Erro:', e)
            return False

# Instância da classe JsonMedico
bd = BD()

# Rota destinada a fazer a verificação dos dados do médico e cadastrá-los no BD
@app.route('/cadastrar-dados', methods=['POST'])
def cadastrar_dados():
    dados = request.get_json()
    erros = {'erro_crm': False, 'erro_cpf': False}

    if (bd.verificar_crm_medico(dados)):
        erros['erro_crm'] = True

    if (bd.verificar_cpf_medico(dados)):
        erros['erro_cpf'] = True

    elif (erros['erro_cpf'] == True or erros['erro_crm'] == True):
        return jsonify(erros)
    

    bd.adicionar_medico(dados)
    return jsonify(erros)


# Execução do flask
if __name__ == '__main__':
    app.run(debug=True, port=5000)