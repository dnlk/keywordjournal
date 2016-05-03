# Author: Daniel Kinney
# All rights reserved

import string
import random

from werkzeug import security


RAND_CHAR_POOL = string.digits + string.ascii_letters


def hash_pw(pw):
    return security.generate_password_hash(pw)

def gen_random_str(n=16):
    return ''.join(random.choice(RAND_CHAR_POOL) for _ in range(16))


def validate_password(hashed_pw, password):
    # todo explore how to handle unfound user
    # curs = flask.g.db.cursor()
    # get_pw_query = 'SELECT password FROM user WHERE email = "%s"' % email
    # res = curs.execute(get_pw_query)

    return security.check_password_hash(hashed_pw, password)
