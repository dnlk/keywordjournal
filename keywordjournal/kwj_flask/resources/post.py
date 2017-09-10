# Author: Daniel Kinney
# All rights reserved

import datetime

from keywordjournal.journal_parser import parser

from keywordjournal.kwj_flask.resources import user_keyword as user_keyword_resource
from keywordjournal.kwj_flask.resources import user as user_resource
from keywordjournal.kwj_flask.connection.manager import db
from keywordjournal.models.db import Post, PostedArg, PostedKeyword


def lookup_func(identifier, valid_resource, field):
    field_parts = field.split('.')
    obj = valid_resource
    for p in field_parts:
        obj = getattr(obj, p)
    return identifier == obj


class ResourceNotFound(Exception):
    pass


def lookup_resource(identifier, valid_resources, field, lookup_func=lookup_func):
    for vr in valid_resources:
        if lookup_func(identifier, vr, field):
            return vr
    raise ResourceNotFound()


def filter_valid(objs, identifier, valid_resources, field):
    for o in objs:
        try:
            yield o, lookup_resource(identifier, valid_resources, field)
        except ResourceNotFound:
            continue


def _construct_posted_keywords(posted_keywords, user_keywords_rs):
    posted_keywords = []
    for keyword in posted_keywords:
        user_keyword_r = lookup_resource(keyword.word, user_keywords_rs, 'word')
        if user_keyword_r is None:
            continue
        posted_args_rs = []
        for arg in keyword.args:
            posted_arg_r = lookup_resource(arg.name, user_keyword_r.user_args, 'param_name')
            if posted_arg_r is None:
                continue
            posted_args_rs.append(PostedArg(user_keyword_arg=arg.name, param_value=arg.value))
        posted_keywords.append(PostedKeyword(user_keyword=user_keyword_r, user_keyword_posted_args=posted_args_rs))
    return posted_keywords


def create(user_id, post_title, post_body):
    posted_keywords = parser.find_all_keywords_with_args(post_body)
    user_keywords_rs = user_keyword_resource.get_all_keywords_with_args(user_id)
    posted_keywords_rs = _construct_posted_keywords(posted_keywords, user_keywords_rs)

    post = Post(
        user_id=user_id,
        text=post_body,
        header=post_title,
        datetime=datetime.datetime.now(),
        posted_keywords=posted_keywords_rs,
    )

    db.add(post)
    db.commit()

    return post


def get_all(user_id):
    user = user_resource.get_by_id(user_id)
    posts = user.posts
    return [
        {
            'post_title': p.header,
            'post_body': p.text,
            'datetime': p.datetime,
            'keywords': [
                {
                    'name': posted_keyword.user_keyword.keyword.word,
                    'args': {
                        posted_arg.user_arg.param_name: posted_arg.param_value
                        for posted_arg in posted_keyword.posted_args
                    }
                } for posted_keyword in p.posted_keywords
            ]
        } for p in posts
    ]


# def persist_tags_with_args(tags_with_args, post):
#
#     tags_with_args = parser.find_all_keywords_with_args(post)
#
#     user = user_resource.get_from_session()
#
#     for tag, args in tags_with_args.items():
#         keyword = keyword_resource.get(word=tag)
#
#         user_keyword = user_keyword_resource.get(keyword, user)
#
#         if user_keyword is None:
#             continue
#
#         user_keyword_posted = user_keyword_posted_resource.create(user_keyword, post)
#
#         all_user_keyword_args = user_keyword_arg_resource.get_all(user_keyword)
#
#         for arg_set in args:
#             for arg, value in arg_set.items():
#
#                 user_keyword_arg = all_user_keyword_args.get(arg)
#                 if user_keyword_arg is None:
#                     continue
#
#                 user_keyword_posted_arg_resource.create(user_keyword_arg, user_keyword_posted, value)
