#!/bin/bash


python /srv/kwj/scripts/init_db_test_values.py

cd /srv/kwj/keywordjournal/kwj_flask/static/jspm
jspm install
