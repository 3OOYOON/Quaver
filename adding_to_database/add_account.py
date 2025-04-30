import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor

from config import Config


def get_connection(autocommit: bool = True) -> MySQLConnection:
    config = Config()
    db_conf = {
        "host": config.tidb_host,
        "port": config.tidb_port,
        "user": config.tidb_user,
        "password": config.tidb_password,
        "database": config.tidb_db_name,
        "autocommit": autocommit,
        "use_pure": True
    }

    if config.ca_path:
        db_conf["ssl_verify_cert"] = True
        db_conf["ssl_verify_identity"] = True
        db_conf["ssl_ca"] = config.ca_path
    return mysql.connector.connect(**db_conf)


def make_accounts_table():
    with get_connection(autocommit=False) as connection:
        with connection.cursor() as cur:
            cur.execute("DROP TABLE IF EXISTS accounts;")
            cur.execute(
                """
                CREATE TABLE accounts (
                    id INT AUTO_INCREMENT,
                    username VARCHAR(255),
                    favsong VARCHAR(255)
                );
            """
            )


def add_to_accounts(username, favsong):
    with get_connection() as connection:
        with connection.cursor() as cur:
            cur.execute(
                f"""
                INSERT INTO accounts (username, favsong)
                    VALUES ('{username}', '{favsong}');
            """
            )


def print_accounts():
    with get_connection(autocommit=False) as connection:
        with connection.cursor() as cur:
            cur.execute(
                f"""
                SELECT * FROM accounts;
            """
            )
            print(cur.fetchall())


if __name__ == "__main__":
    # make_accounts_table()
    add_to_accounts("testusername222", "KJDFLHFS3uhuriohfGLHSFLG")
    # add_to_accounts("test2", "Cooler Song")
    print_accounts()