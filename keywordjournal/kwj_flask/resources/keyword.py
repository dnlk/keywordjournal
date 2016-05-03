# Author: Daniel Kinney
# All rights reserved

from keywordjournal.kwj_flask.connection import manager

from keywordjournal.kwj_flask.models.db import Keyword


def get(word):
    res = manager.proxy_session.query(Keyword).filter_by(word=word).first()
    return res
