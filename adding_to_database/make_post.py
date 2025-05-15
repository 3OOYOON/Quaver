import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from connect import get_connection

# Don't add posts this way, this is for testing purposes only. Use the cursor execute stuff
def make_post(post_info):
    query = 'INSERT INTO posts (posterID, forumText, parentID) VALUES (%s, %s, %s)'
    post_values = (post_info['posterID'], post_info['forumText'], post_info['parentID'])
    with get_connection(autocommit=True) as connection:
        with connection.cursor() as cur:
            cur.execute(query, post_values)

def main():
    post = {
        'posterID' : 1,
        'forumText' : 'my first coolest forum post',
        'parentID' : None
    }
    make_post(post)

if __name__=='__main__':
    main()