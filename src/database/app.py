import os
from flask import Flask, jsonify, request, session
from flask_session import Session
from flask_cors import CORS
import pymysql
import pymysql.cursors

# Inicializa o flask
app = Flask(__name__)
app.secret_key = 'raisoares123!'

app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

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
            database='sistema_hospitalar',
            cursorclass=pymysql.cursors.DictCursor
        )

    def exists_in_bd(self, item, dados):

        try:
            with self.conexao.cursor() as cursor:
                sql = f"SELECT * FROM medicos WHERE {item} = %s"

                dado_verificador = (dados[item],)

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

                if (not self.exists_in_bd('cpf', dados) and not self.exists_in_bd('crm', dados)):

                    sql = "INSERT INTO medicos (nome, senha, cpf, especializacao, uf, crm) VALUES (%s, %s, %s, %s, %s, %s)"

                    valores = (dados['nome'], dados['senha'], dados['cpf'], dados['especializacao'], dados['uf'], dados['crm'])   

                    cursor.execute(sql, valores)

                    self.conexao.commit()
                    return True
                
            return False

        except Exception as e:
            print('Erro:', e)
            return False

# Instância da classe BD
bd = BD()


@app.route('/cadastrar-medico', methods=['POST'])
def cadastrar_medico():
    dados = request.get_json()
    erros = {'erro_crm': False, 'erro_cpf': False}

    exists_crm = bd.exists_in_bd('crm', dados)
    exists_cpf = bd.exists_in_bd('cpf', dados)

    if (exists_crm):
        erros['erro_crm'] = True

    if (exists_cpf):
        erros['erro_cpf'] = True

    elif (exists_crm and exists_cpf):
        return jsonify(erros)
    

    bd.adicionar_medico(dados)
    return jsonify(erros)



@app.route('/logar-medico', methods=['POST'])
def logar_medico():
    dados = request.get_json()
    erros = {'erro_crm': False, 'erro_senha': False}

    exists_crm = bd.exists_in_bd('crm', dados)
    exists_senha = bd.exists_in_bd('senha', dados)

    if (not exists_crm):
        erros['erro_crm'] = True

    if (not exists_senha):
        erros['erro_senha'] = True

    if (not exists_crm or not exists_senha):
        return jsonify(erros)

    session['medico'] = exists_crm
    return jsonify(erros)



# Execução do flask
if __name__ == '__main__':
    app.run(debug=True, port=5000)