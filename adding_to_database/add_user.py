import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from connect import get_connection

def add_user(username):
    with get_connection(autocommit=True) as connection:
        with connection.cursor() as cur:
            cur.execute(f'INSERT INTO users (username) VALUES (\'{username}\')')
    return get_userID_from_username(username)


def get_userID_from_username(username):
    with get_connection(autocommit=True) as connection:
        with connection.cursor() as cur:
            cur.execute(f'SELECT userID FROM users WHERE username=\'{username}\'')
            userID = cur.fetchall()[0][0]
    return userID


def main():
    add_user('newUser')

if __name__=='__main__':
    main()