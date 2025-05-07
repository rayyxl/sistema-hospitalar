from flask_login import UserMixin

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
