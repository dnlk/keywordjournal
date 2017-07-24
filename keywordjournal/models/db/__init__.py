# Author: Daniel Kinney
# All rights reserved

import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base
import sqlalchemy.orm as sa_orm

Base = declarative_base()


class Keyword(Base):
    __tablename__ = 'keyword'

    id = sa.Column(sa.Integer, primary_key=True)
    word = sa.Column(sa.String, unique=True)

    user_keywords = sa_orm.relationship('UserKeyword', back_populates='keyword')


class User(Base):
    __tablename__ = 'user'

    id = sa.Column(sa.Integer, primary_key=True)
    email = sa.Column(sa.String, unique=True)
    password = sa.Column(sa.String)

    user_keywords = sa_orm.relationship('UserKeyword', back_populates='user')
    posts = sa_orm.relationship('Post', back_populates='user')
    user_session = sa_orm.relationship('UserSession', back_populates='user')


class UserKeyword(Base):
    __tablename__ = 'user_keyword'

    id = sa.Column(sa.Integer, primary_key=True)
    keyword_id = sa.Column(sa.Integer, sa.ForeignKey('keyword.id'))
    user_id = sa.Column(sa.Integer, sa.ForeignKey('user.id'))

    keyword = sa_orm.relationship('Keyword', back_populates='user_keywords')
    user = sa_orm.relationship('User', back_populates='user_keywords')
    user_args = sa_orm.relationship('UserArg', back_populates='user_keyword')
    posted_keywords = sa_orm.relationship('PostedKeyword', back_populates='user_keyword')

    __table_args__ = (
        sa.UniqueConstraint('keyword_id', 'user_id', name='user_keyword'),
    )


class UserArg(Base):
    __tablename__ = 'user_arg'

    id = sa.Column(sa.Integer, primary_key=True)
    user_keyword_id = sa.Column(sa.Integer, sa.ForeignKey('user_keyword.id'))
    param_name = sa.Column(sa.String)
    param_type = sa.Column(sa.String)

    user_keyword = sa_orm.relationship('UserKeyword', back_populates='user_args')
    posted_args = sa_orm.relationship('PostedArg', back_populates='user_arg')

    __table_args__ = (
        sa.UniqueConstraint('user_keyword_id', 'param_name', name='keyword_arg'),
    )


class Post(Base):
    __tablename__ = 'post'

    id = sa.Column(sa.Integer, primary_key=True)
    user_id = sa.Column(sa.Integer, sa.ForeignKey('user.id'))
    text = sa.Column(sa.String)
    header = sa.Column(sa.String)
    datetime = sa.Column(sa.DateTime)

    user = sa_orm.relationship('User', back_populates='posts')
    posted_keywords = sa_orm.relationship('PostedKeyword', back_populates='post')


class PostedKeyword(Base):
    __tablename__ = 'posted_keyword'

    id = sa.Column(sa.Integer, primary_key=True)
    user_keyword_id = sa.Column(sa.Integer, sa.ForeignKey('user_keyword.id'))
    post_id = sa.Column(sa.Integer, sa.ForeignKey('post.id'))

    user_keyword = sa_orm.relationship('UserKeyword', back_populates='posted_keywords')
    post = sa_orm.relationship('Post', back_populates='posted_keywords')
    posted_args = sa_orm.relationship('PostedArg', back_populates='posted_keyword')


class PostedArg(Base):
    __tablename__ = 'posted_arg'

    id = sa.Column(sa.Integer, primary_key=True)
    user_keyword_posted_id = sa.Column(sa.Integer, sa.ForeignKey('posted_keyword.id'))
    arg_id = sa.Column(sa.Integer, sa.ForeignKey('user_arg.id'))
    param_value = sa.Column(sa.String)

    posted_keyword = sa_orm.relationship('PostedKeyword', back_populates='posted_args')
    user_arg = sa_orm.relationship('UserArg', back_populates='posted_args')



class UserSession(Base):
    __tablename__ = 'user_session'

    id = sa.Column(sa.Integer, primary_key=True)
    user_id = sa.Column(sa.Integer, sa.ForeignKey('user.id'))
    token = sa.Column(sa.String)
    created = sa.Column(sa.DateTime)

    user = sa_orm.relationship('User', back_populates='user_session')
