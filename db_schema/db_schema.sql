CREATE TABLE keyword (
	id INTEGER PRIMARY KEY,
	word TEXT
);

CREATE TABLE user (
	id INTEGER PRIMARY KEY,
	email TEXT,
	password TEXT
);

CREATE TABLE user_keyword (
	id INTEGER PRIMARY KEY,
	keyword_id INTEGER,
	user_id INTEGER
);

CREATE TABLE user__arg (
	id INTEGER PRIMARY KEY,
	user_keyword_id INTEGER,
	param_name TEXT
);

CREATE TABLE post (
	id INTEGER PRIMARY KEY,
	user_id INTEGER,
	text TEXT,
	header TEXT,
	datetime DATETIME
);

CREATE TABLE user_keyword_posted (
	id INTEGER PRIMARY KEY,
	user_keyword_id INTEGER,
	post_id INTEGER
);

CREATE TABLE user_keyword_posted_arg (
	id INTEGER PRIMARY KEY,
	user_keyword_posted_id INTEGER,
	arg_id INTEGER,
	param_value TEXT
);

CREATE TABLE user_session (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    token TEXT,
    created DATETIME
);
