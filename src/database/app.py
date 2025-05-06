import os
from flask import Flask, jsonify, request, session
from flask_session import Session
from flask_cors import CORS
import pymysql
import pymysql.cursors
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash




# Inicializa o flask
app = Flask(__name__)
app.secret_key = 'raisoares123!'

app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False

Session(app)

# o flask aceitará requisições de outros domínios
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)



# Setup Flask-Login
login_manager = LoginManager()
login_manager.login_view = '/login'
login_manager.init_app(app)


# Limpar o terminal (válido apenas no windows)
os.system('cls')



class Medico(UserMixin):
    def __init__(self, nome, senha, cpf, especializacao, uf, crm):
        self.nome = nome
        self.senha = senha
        self.cpf = cpf
        self.especializacao = especializacao
        self.uf = uf
        self.crm = crm

    def get_id(self):
        return str(self.crm)

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

                try:
                    cursor.execute(sql, dado_verificador)

                    resultado = cursor.fetchone()

                    return resultado
                except:
                    return False
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
        
@login_manager.user_loader
def load_user(user_id):
    try:
        with bd.conexao.cursor() as cursor:
            # Buscando o médico pelo CRM (user_id)
            sql = "SELECT * FROM medicos WHERE crm = %s"
            cursor.execute(sql, (user_id,))
            result = cursor.fetchone()
            if result:
                return Medico(result['nome'], result['senha'], result['cpf'], result['especializacao'], result['uf'], result['crm'])
            return None
    except Exception as e:
        print(f"Erro no user_loader: {e}")
        return None

# Instância da classe BD
bd = BD()




@app.route('/login', methods=['GET', 'POST'])
def login():
    if not current_user.is_authenticated:
        return jsonify({"mensagem": False}), 401


@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"logout": True})





@app.route('/cadastrar-medico', methods=['POST', 'GET'])
def cadastrar_medico():
    if request.method == 'POST':
        # Lógica para cadastrar o médico
        dados = request.get_json()
        erros = {'erro_crm': False, 'erro_cpf': False}

        exists_crm = bd.exists_in_bd('crm', dados)
        exists_cpf = bd.exists_in_bd('cpf', dados)

        if (exists_crm):
            erros['erro_crm'] = True

        if (exists_cpf):
            erros['erro_cpf'] = True

        elif (exists_crm or exists_cpf):
            return jsonify(erros)

        bd.adicionar_medico(dados)
        return jsonify(erros)

    # Lógica para o GET: retornar a página de cadastro ou um formulário
    return "Página de cadastro"



@app.route('/logar-medico', methods=['POST'])
def logar_medico():
    dados = request.get_json()
    erros = {'erro_crm': False, 'erro_senha': False}

    exists_dados = bd.exists_in_bd('crm', dados)

    if not exists_dados or exists_dados['senha'] != dados['senha']:
        erros['erro_crm'] = not exists_dados
        erros['erro_senha'] = True
        return jsonify(erros)

    

    medico = Medico(exists_dados['nome'], exists_dados['senha'], exists_dados['cpf'], exists_dados['especializacao'], exists_dados['uf'], exists_dados['crm'])

    login_user(medico)
    return jsonify(erros)




@app.route('/retornar-medico')
@login_required
def retornar_medico():
    medico_info = {
            'nome': current_user.nome,
            'cpf': current_user.cpf,
            'especializacao': current_user.especializacao,
            'uf': current_user.uf,
            'crm': current_user.crm
        }
    print(medico_info)
    return jsonify({"mensagem": True, "dados": medico_info})
    


# Execução do flask
if __name__ == '__main__':
    app.run(debug=True, port=5000)

# 723049/CRM-PB
# Railindao123!