# Author: Daniel Kinney
# All rights reserved


from keywordjournal.kwj_flask.connection.manager import db, engine

from keywordjournal.models.db import *


keyword1 = Keyword(
    word='kw1'
)

keyword2 = Keyword(
    word='kw2'
)

user1 = User(
    email='dan@dan.dan',
    password='pbkdf2:sha1:1000$yo8btyOc$8dbbc0b05cb5ebb6c70c0215886d399be3c7f1f9',
    user_keywords=[
        UserKeyword(
            keyword=keyword1,
            user_args=[UserArg(param_name='x'), UserArg(param_name='y')]
        )
    ]
)

user2 = User(
    email='janna@janna.janna',
    password='pbkdf2:sha1:1000$6BlU9yBs$4efa5bf4f6d7c0436d37280657afe16603f8fbf9'
)


if __name__ == '__main__':
    Base.metadata.create_all(bind=engine)
    db.add(user1)
    db.add(user2)
    db.commit()
