# Author: Daniel Kinney
# All rights reserved


class Model:
    __slots__ = ()

    def __init__(self, **kw):
        for k, v in kw.items():
            setattr(self, k, v)


class Keyword(Model):
    __slots__ = 'word', 'args'


class Arg(Model):
    __slots__ = 'name', 'value'
