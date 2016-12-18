# Author: Daniel Kinney
# All rights reserved

#
# from keywordjournal.kwj_flask.connection import manager
#
# from keywordjournal.kwj_flask.models.db import UserKeywordArg


# def get_all(user_keyword):
#     user_keyword_args = user_keyword.user_keyword_args
#     return {arg.param_name: arg for arg in user_keyword_args}


from keywordjournal.kwj_flask.connection import manager

from keywordjournal.models.db import UserArg, UserKeyword, Keyword

def create(user_id, keyword, arg_name, arg_type):
    # TODO - need to implement the arg type

    keyword = manager.proxy_session.query(Keyword).filter_by(word=keyword).first()
    user_keyword = manager.proxy_session.query(UserKeyword).filter_by(user_id=user_id, keyword_id=keyword.id).first()

    new_arg = UserArg(user_keyword_id=user_keyword.id, param_name=arg_name)

    manager.proxy_session.add(new_arg)
    manager.proxy_session.commit()
