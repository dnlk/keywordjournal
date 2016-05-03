# Author: Daniel Kinney
# All rights reserved


from keywordjournal.kwj_flask.connection import manager
from keywordjournal.kwj_flask.connection.manager import db

from keywordjournal.models.db import UserKeyword
from keywordjournal.models.db import UserArg


def get(keyword, user):
    res = manager.proxy_session.query(UserKeyword).filter_by(keyword_id=keyword.id, user_id=user.id).first()
    return res


def get_all_keywords_with_args(user_id):
    return db.query(UserKeyword).join(UserArg).filter(UserKeyword.user_id == user_id).all()


# def repr_keywords_with_args_vals(keyword_with_args):
#     res_dict = {}
#     for kw in keyword_with_args:
#         word = kw.keyword.word
#         res_list = []
#         res_dict[word] = res_list
#         for arg in kw.user_keyword_args:
#             res_list.append(arg.param_name)
#     return res_dict
