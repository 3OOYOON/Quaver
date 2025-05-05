import mysql.connector
from mysql.connector import MySQLConnection
from mysql.connector.cursor import MySQLCursor
from connect import get_connection


# def get_posts_by_user(userID):
#     with get_connection(autocommit=True) as connection:
#         with connection.cursor() as cur:
#             cur.execute(user)

# def main():
#     get_posts_by_user(1)