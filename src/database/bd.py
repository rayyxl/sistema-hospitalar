import pymysql

class BD:
    def __init__(self):
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
                sql = f"SELECT nome, senha, cpf, especializacao, uf, crm FROM medicos WHERE {item} = %s"
                cursor.execute(sql, (dados[item],))
                return cursor.fetchone()
        except Exception as e:
            print('Erro:', e)
            return False

    def adicionar_medico(self, dados):
        try:
            with self.conexao.cursor() as cursor:
                if not self.exists_in_bd('cpf', dados) and not self.exists_in_bd('crm', dados):
                    sql = "INSERT INTO medicos (nome, senha, cpf, especializacao, uf, crm) VALUES (%s, %s, %s, %s, %s, %s)"
                    cursor.execute(sql, (
                        dados['nome'], dados['senha'], dados['cpf'],
                        dados['especializacao'], dados['uf'], dados['crm']
                    ))
                    self.conexao.commit()
                    return True
            return False
        except Exception as e:
            print('Erro:', e)
            return False

    def buscar_medico_por_crm(self, crm):
        try:
            with self.conexao.cursor() as cursor:
                sql = "SELECT nome, senha, cpf, especializacao, uf, crm FROM medicos WHERE crm = %s"
                cursor.execute(sql, (crm,))
                return cursor.fetchone()
        except Exception as e:
            print('Erro:', e)
            return None
