import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from connect import get_connection

# Don't add posts this way, this is for testing purposes only. Use the cursor execute stuff
def make_post(post):
    parentID = post['parentID']
    if parentID == None: parentID = 'NULL'
    query = f'''
    INSERT INTO posts 
        (posterID, forumText, parentID)
    VALUES
        ({post['posterID']}, '{post['forumText']}', {parentID})
    '''
    with get_connection(autocommit=True) as connection:
        with connection.cursor() as cur:
            cur.execute(query)

def main():
    post = {
        'posterID' : 1,
        'forumText' : 'my first coolest forum post',
        'parentID' : None
    }
    make_post(post)

if __name__=='__main__':
    main()