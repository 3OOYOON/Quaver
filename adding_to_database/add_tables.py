import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from connect import get_connection


def make_table(table_name, fields):
    with get_connection(autocommit=True) as connection:
        with connection.cursor() as cur:
            cur.execute(f"DROP TABLE IF EXISTS {table_name};")
            cur.execute(f"CREATE TABLE {table_name} ({fields});")

def main():
    make_table('users', """
               userID INT AUTO_INCREMENT,
               username VARCHAR(255)
               """)
    make_table('posts', """
               postID INT AUTO_INCREMENT,
               parentID INT,
               posterID INT,
               forumText VARCHAR(255)
               """)
    make_table('postsToTags', """
               postID INT,
               tag VARCHAR(255)
               """)
    make_table('postsLikes', """
               postID INT,
               likerID INT
               """)
    make_table('follows', """
               followerID INT,
               followedID INT
               """)

if __name__=='__main__':
    main()