# Author: Daniel Kinney
# All rights reserved

import re
import json
import collections

# from keywordjournal.models import PostedArg, PostedKeyword, UserKeyword
from keywordjournal.models.schema import Keyword, Arg

TAG_EXP_MATCHER = re.compile('#[a-z|A-Z|0-9]*(?:\(.*?\))?')
TAG_MATCHER = re.compile('#[a-z|A-Z|0-9]*')
ARGS_MATCHER = re.compile('\(.*\)')

USER_KEYWORD = 'user_keyword'
USER_KEYWORD_ARG = 'user_keyword_arg'


def extract_tag(text):
    tag = TAG_MATCHER.findall(text)[0][1:]
    return tag


def extract_args(text):
    args_list = []
    try:
        args_unparsed_text = ARGS_MATCHER.findall(text)[0][1: -1]
    except IndexError:
        return args_list

    for kwarg in args_unparsed_text.split(','):
        name, value = kwarg.split(':')
        args_list.append(Arg(name=name, value=value))
    return args_list


def parse_match(text):
    tag = extract_tag(text)
    args = extract_args(text)
    return tag, args


def find_all_keywords_with_args(text):
    all_matches = TAG_EXP_MATCHER.findall(text)
    keywords_list = []
    for match in all_matches:
        tag, args = parse_match(match)
        keywords_list.append(Keyword(word=tag, args=args))
    return keywords_list
