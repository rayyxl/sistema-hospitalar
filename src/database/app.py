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

    def adicionar_login(self, dados):

        try:
            with self.conexao.cursor() as cursor:

                sql = "INSERT INTO dados_login (nome, senha, especializacao, uf, crm) VALUES (%s, %s, %s, %s, %s)"
                valores = (dados['nome'], dados['senha'], dados['especializacao'], dados['uf'], dados['crm'])      
                cursor.execute(sql, valores)
                self.conexao.commit()
                return True
            
        except Exception as e:
            print('Erro:', e)
            return False

# Instância da classe JsonMedico
bd = BD()

# Rota destinada a fazer a verificação dos dados do médico e cadastrá-los no BD
@app.route('/cadastrar-dados', methods=['POST'])
def cadastrar_dados():
    dados = request.get_json()
    resposta = bd.adicionar_login(dados)
    return jsonify(True)


# Execução do flask
if __name__ == '__main__':
    app.run(debug=True, port=5000)