# Author: Daniel Kinney
# All rights reserved

from sqlalchemy.exc import IntegrityError

from keywordjournal.kwj_flask.connection import manager
from keywordjournal.kwj_flask.connection.manager import db

from keywordjournal.models.db import UserKeyword
from keywordjournal.models.db import UserArg

from keywordjournal.kwj_flask import resources


def get(user_id, keyword):
    keyword_res = resources.keyword.get(keyword)
    user_keyword_res = manager.proxy_session.query(UserKeyword).filter_by(keyword_id=keyword_res.id, user_id=user_id).first()
    return user_keyword_res


def get_all_keywords_with_args(user_id):
    return db.query(UserKeyword).outerjoin(UserArg).filter(UserKeyword.user_id == user_id).all()


def create(keyword, user_id):

    keyword_res = resources.keyword.get(keyword)
    if keyword_res is None:
        # Possible race condition
        try:
            keyword_res = resources.keyword.create(keyword)
        except IntegrityError:
            db.rollback()
            keyword_res = resources.keyword.get(keyword)

    user_keyword = UserKeyword(
        keyword_id=keyword_res.id,
        user_id=user_id,
    )

    try:
        db.add(user_keyword)
        db.commit()
        return user_keyword
    except IntegrityError:
        db.rollback()
        return None

# def repr_keywords_with_args_vals(keyword_with_args):
#     res_dict = {}
#     for kw in keyword_with_args:
#         word = kw.keyword.word
#         res_list = []
#         res_dict[word] = res_list
#         for arg in kw.user_keyword_args:
#             res_list.append(arg.param_name)
#     return res_dict
