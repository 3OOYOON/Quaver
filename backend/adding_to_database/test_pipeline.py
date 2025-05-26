from connect import get_connection
from add_user import *
from make_post import *
from get_posts import *




def main():
    userID = add_user('jimmy')

    post = {
        'posterID' : userID,
        'forumText' : 'This is my first jimmy post!',
        'parentID' : None
    }
    make_post(post)

    post = {
        'posterID' : userID,
        'forumText' : 'This is my second jimmy post!',
        'parentID' : None
    }
    make_post(post)

    post = {
        'posterID' : userID,
        'forumText' : 'This is my third jimmy post!',
        'parentID' : None
    }
    make_post(post)


    otherID = add_user('otherjimmy')

    post = {
        'posterID' : otherID,
        'forumText' : 'Wow that guy jimmy has some boring posts!',
        'parentID' : None
    }
    make_post(post)

    post = {
        'posterID' : otherID,
        'forumText' : 'I repeat: boring',
        'parentID' : None
    }
    make_post(post)

    print(get_posts_by_user(userID))
    print(get_posts_by_user(otherID))

if __name__ == '__main__':
    main()