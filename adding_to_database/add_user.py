import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from connect import get_connection

def add_user(username):
    with get_connection(autocommit=True) as connection:
        with connection.cursor() as cur:
            cur.execute(f'INSERT INTO users (username) VALUES (\'{username}\')')

def main():
    add_user('newUser')

if __name__=='__main__':
    main()