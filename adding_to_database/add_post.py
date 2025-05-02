import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from connect import get_connection


def add_post(post):
    parent = post['parent']
    if parent == None: parent = 'NULL'
    query = f'''
    INSERT INTO posts 
        (poster, forumText, parent)
    VALUES
        ({post['poster']}, '{post['forumText']}', {parent})
    '''
    with get_connection(autocommit=True) as connection:
        with connection.cursor() as cur:
            cur.execute(query)

def main():
    post = {
        'poster' : 1,
        'forumText' : 'my first coolest forum post',
        'parent' : None
    }
    add_post(post)

if __name__=='__main__':
    main()