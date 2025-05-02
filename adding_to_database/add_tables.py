import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from connect import get_connection


def make_table(table_name, query):
    with get_connection(autocommit=True) as connection:
        with connection.cursor() as cur:
            cur.execute(f"DROP TABLE IF EXISTS {table_name};")
            cur.execute(query)

def main():
    make_table('users', """
                CREATE TABLE users (
                    id INT AUTO_INCREMENT,
                    username VARCHAR(255)
                );
            """)
    make_table('posts', """
                CREATE TABLE posts (
                    id INT AUTO_INCREMENT,
                    forumText VARCHAR(255),
                    poster INT,
                    parent INT
                );
            """)

if __name__=='__main__':
    main()