import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from connect import get_connection


def get_posts_by_user():
    with get_connection(autocommit=True) as connection:
        with connection.cursor() as cur:
            cur.execute(f"DROP TABLE IF EXISTS {table_name};")
            cur.execute(query)

def main():
    get_posts_by_user("jimmy")