# Author: Daniel Kinney
# All rights reserved

import re
import json
import collections

TAG_EXP_MATCHER = re.compile('#[a-z|A-Z|0-9]*(?:\(.*?\))?')
TAG_MATCHER = re.compile('#[a-z|A-Z|0-9]*')
ARGS_MATCHER = re.compile('\(.*\)')


def extract_tag(text):
    tag = TAG_MATCHER.findall(text)[0][1:]
    return tag


def extract_args(text):
    try:
        args_unparsed_text = ARGS_MATCHER.findall(text)[0][1: -1]
    except IndexError:
        return {}
    split_text = args_unparsed_text.split(',')
    res = {}
    for kwarg in split_text:
        kw, arg = kwarg.split(':')
        res[kw.strip()] = arg.strip()
    return res


def parse_match(text):
    tag = extract_tag(text)
    args = extract_args(text)
    return tag, args


def find_all_keywords_with_args(text):
    all_matches = TAG_EXP_MATCHER.findall(text)
    res = collections.defaultdict(list)
    for match in all_matches:
        tag, args = parse_match(match)
        res[tag].append(args)
    return res
