import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from connect import get_connection


def get_posts_by_user(userID):
    with get_connection(autocommit=True) as connection:
        with connection.cursor() as cur:
            cur.execute("""
                    SELECT posts.postID, posts.forumText 
                    FROM users, posts
                    WHERE posts.posterID=users.userID
                    AND users.userID=%s;
                    """, (userID, ))
            posts = cur.fetchall()
            return posts
        
def get_all_posts():
    with get_connection(autocommit=True) as connection:
        with connection.cursor() as cur:
            cur.execute("""
                    SELECT users.userID, users.username, posts.postID, posts.forumText 
                    FROM users, posts
                    WHERE posts.posterID=users.userID;
                    """)
            posts = cur.fetchall()
            return posts

def main():
    posts = get_all_posts()
    print(posts)

if __name__=='__main__':
    main()