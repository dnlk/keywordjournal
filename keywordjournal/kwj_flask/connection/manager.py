# Author: Daniel Kinney
# All rights reserved

import sqlalchemy
from keywordjournal.kwj_flask import app
import sqlalchemy.orm


engine = sqlalchemy.create_engine('sqlite:///' + app.app.config['DATABASE'])
Session = sqlalchemy.orm.sessionmaker(bind=engine)

#todo this isn't much of a proxy at all... but someday...
proxy_session = Session()


class DB:
    _db = Session()

    def __getattr__(self, item):
        return getattr(self._db, item)

db = proxy_session
