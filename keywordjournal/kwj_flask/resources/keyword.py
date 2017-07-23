# Author: Daniel Kinney
# All rights reserved

from keywordjournal.kwj_flask.connection import manager
from keywordjournal.kwj_flask.connection.manager import db

from keywordjournal.models.db import Keyword


def get(word):
    res = manager.proxy_session.query(Keyword).filter_by(word=word).first()
    return res


def create(word):
    new_keyword = Keyword(word=word)
    db.add(new_keyword)
    db.commit()
    return new_keyword
