from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_session import Session
from flask_login import LoginManager, login_user, current_user, login_required, logout_user
from model import Medico
from bd import BD
from os import system

app = Flask(__name__)
app.secret_key = 'raisoares123!'
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False

# Railindao123!
Session(app)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3000"}})

login_manager = LoginManager()
login_manager.login_view = '/login'
login_manager.init_app(app)

system('cls')

bd = BD()

@login_manager.user_loader
def load_user(user_id):
    result = bd.buscar_medico_por_crm(user_id)
    if result:
        return Medico(**result)
    return None

@app.route('/cadastrar-medico', methods=['POST'])
def cadastrar_medico():
    dados = request.get_json()
    erros = {'erro_crm': False, 'erro_cpf': False}

    if bd.exists_in_bd('crm', dados):
        erros['erro_crm'] = True
    if bd.exists_in_bd('cpf', dados):
        erros['erro_cpf'] = True

    if erros['erro_crm'] or erros['erro_cpf']:
        return jsonify(erros)

    bd.adicionar_medico(dados)
    return jsonify(erros)

@app.route('/logar-medico', methods=['POST'])
def logar_medico():
    dados = request.get_json()
    erros = {'erro_crm': False, 'erro_senha': False}
    medico_dados = bd.exists_in_bd('crm', dados)

    if not medico_dados or medico_dados['senha'] != dados['senha']:
        erros['erro_crm'] = not medico_dados
        erros['erro_senha'] = True
        return jsonify(erros)

    medico = Medico(**medico_dados)
    login_user(medico)
    return jsonify(erros)

@app.route('/login', methods=['GET'])
def login():
    if current_user.is_authenticated:
        return jsonify({
            "mensagem": "Página de login",
            "usuario": {
                'nome': current_user.nome,
                'cpf': current_user.cpf,
                'especializacao': current_user.especializacao,
                'uf': current_user.uf,
                'crm': current_user.crm
            }
        })
    else:
        return jsonify({"mensagem": "Usuário não autenticado"}), 401

@app.route('/retornar-medico')
@login_required
def retornar_medico():
    return jsonify({
        'nome': current_user.nome,
        'cpf': current_user.cpf,
        'especializacao': current_user.especializacao,
        'uf': current_user.uf,
        'crm': current_user.crm
    })

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"logout": True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
