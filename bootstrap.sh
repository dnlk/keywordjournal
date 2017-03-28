#!/usr/bin/env bash

apt-get update

apt-get install -y python3.5

# Various tools that are useful for building projects
apt-get install -y build-essential

# c API to openssl (for some cryptographic stuff)
apt-get install -y libssl-dev

apt-get install -y curl

apt-get install -y nodejs

apt-get install -y npm

# apt-get install -y python3-venv

apt-get install -y git

# pyvenv /srv/venv
# source /srv/venv/bin/activate

apt-get install -y python3-setuptools

easy_install3 pip

export KEYWORDJOURNAL_DB_PATH='/srv/keywordjournal_db'

echo /srv/kwj > /usr/local/lib/python3.5/dist-packages/paths.pth

ln -s /usr/bin/nodejs /usr/bin/node

npm install -g jspm

rm /usr/bin/python
ln -s /usr/bin/python3.5 /usr/bin/python

ln -s /vagrant /srv/kwj

ln -s /srv/kwj/scripts/setup.sh /usr/bin/setup-kwj
ln -s /srv/kwj/scripts/runserver.sh /usr/bin/runserver-kwj

pip install -r /srv/kwj/requirements.txt
