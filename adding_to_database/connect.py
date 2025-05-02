import os
from dotenv import load_dotenv
import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor


class Config:
    def __init__(self):
        load_dotenv()
        self.tidb_host = os.getenv("TIDB_HOST", "127.0.0.1")
        self.tidb_port = int(os.getenv("TIDB_PORT", "4000"))
        self.tidb_user = os.getenv("TIDB_USER", "root")
        self.tidb_password = os.getenv("TIDB_PASSWORD", "")
        self.tidb_db_name = os.getenv("TIDB_DB_NAME", "test")
        self.ca_path = os.getenv("CA_PATH", "")

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
