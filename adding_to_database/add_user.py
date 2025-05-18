import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from connect import get_connection

def add_user(user_info):
    user_values = (user_info['username'], user_info['password'])
    username = user_info['username']
    with get_connection(autocommit=True) as connection:
        with connection.cursor() as cur:
            cur.execute('INSERT INTO users (username, password) VALUES (%s, %s)', user_values)
    return get_userID_from_username(username)


def get_userID_from_username(username):
    with get_connection(autocommit=True) as connection:
        with connection.cursor() as cur:
            cur.execute('SELECT userID FROM users WHERE username=%s', (username, ))
            userID = cur.fetchall()[0][0]
    return userID

# def signUp(username, email, pword, cpword):
#     if (pword != cpword):
#         return failure
#     if email isnt in database
    
#     if username isnt in database
    
#     add_user(username)
    

def main():
    user_info = {
        'username':'testUser'
    }
    add_user(user_info)

if __name__=='__main__':
    main()