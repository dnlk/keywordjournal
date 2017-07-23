# Author: Daniel Kinney
# All rights reserved

#
# from keywordjournal.kwj_flask.connection import manager
#
# from keywordjournal.kwj_flask.models.db import UserKeywordArg


# def get_all(user_keyword):
#     user_keyword_args = user_keyword.user_keyword_args
#     return {arg.param_name: arg for arg in user_keyword_args}

from sqlalchemy.exc import IntegrityError


from keywordjournal.kwj_flask.connection import manager

from keywordjournal.models.db import UserArg, UserKeyword, Keyword
from keywordjournal.kwj_flask import resources


def get(user_keyword_id, param_name):
    res = manager.proxy_session.query(UserArg).filter_by(
        user_keyword_id=user_keyword_id,
        param_name=param_name,
    ).first()
    return res


def create(user_id, keyword, arg_name, arg_type):
    # TODO - need to implement the arg type

    user_keyword = resources.user_keyword.get(user_id=user_id, keyword=keyword)

    new_arg = UserArg(user_keyword_id=user_keyword.id, param_name=arg_name)

    try:
        manager.proxy_session.add(new_arg)
        manager.proxy_session.commit()
        return new_arg
    except IntegrityError:
        manager.proxy_session.rollback()
        return None
