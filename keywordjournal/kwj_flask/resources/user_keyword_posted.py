# Author: Daniel Kinney
# All rights reserved

#
from keywordjournal.kwj_flask.connection import manager
#
from keywordjournal.models.db import PostedKeyword, PostedArg
from keywordjournal.kwj_flask import resources


# def create(user_keyword, post):
#     user_keyword_posted = UserKeywordPosted(user_keyword_id=user_keyword.id, post_id=post.id)
#     manager.proxy_session.add(user_keyword_posted)
#     return user_keyword_posted


def create(user_id, post_id, keyword, args):

    user_keyword = resources.user_keyword.get(user_id, keyword)

    posted_keyword = PostedKeyword(
        user_keyword_id=user_keyword.id,
        post_id=post_id,
    )
    manager.proxy_session.add(posted_keyword)
    manager.proxy_session.commit()

    for param_name, param_value in args.items():
        user_arg = resources.user_keyword_arg.get(
            user_keyword_id=user_keyword.id,
            param_name=param_name,
        )

        posted_arg = PostedArg(
            user_keyword_posted_id=posted_keyword.id,
            arg_id=user_arg.id,
            param_value=param_value,
        )

        manager.proxy_session.add(posted_arg)

    manager.proxy_session.commit()

    return posted_keyword
