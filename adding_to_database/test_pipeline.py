from connect import get_connection
from add_user import *
from make_post import *
from get_posts import *




def main():
    user_info = {
        'username':'jimmy',
        'password':'jimmy123'
    }
    userID = add_user(user_info)

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


    user_info = {
        'username':'otherjimmy',
        'password':'other!jimmy123'
    }
    otherID = add_user(user_info)

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