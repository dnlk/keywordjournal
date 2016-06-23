FROM ubuntu:16.04
MAINTAINER Daniel Kinney <kinney.daniel.j@gmail.com>

# Use `apt-cache policy <packageName>` to detect which available packages there are

# A hack to make the shell use bash instead of dash. This was needed to use
# "source" function.
RUN ln -snf /bin/bash /bin/sh
# Another way it could work - RUN /bin/bash -c "source /path/to/file"

RUN apt-get update
RUN apt-get install -y python3.5

# Various tools that are useful for building projects
RUN apt-get install -y build-essential=12.1ubuntu2

# c API to openssl (for some cryptographic stuff)
RUN apt-get install -y libssl-dev=1.0.2g-1ubuntu4.1

RUN apt-get install -y curl=7.47.0-1ubuntu2

RUN apt-get install -y nodejs=4.2.6~dfsg-1ubuntu4

RUN apt-get install -y npm=3.5.2-0ubuntu4

RUN apt-get install -y python3-venv=3.5.1-3

RUN apt-get install -y git=1:2.7.4-0ubuntu1

RUN pyvenv /srv/venv
RUN source /srv/venv/bin/activate

ADD requirements.txt /var/requirements.txt

#ADD docker/install_py_req.sh /var/install_py_req.sh
#RUN bash /var/install_py_req.sh

RUN apt-get install -y python3-setuptools

RUN easy_install3 pip

RUN pip install -r /var/requirements.txt

ENV KEYWORDJOURNAL_DB_PATH '/srv/keywordjournal_db'

# Extend the python sys.path to include the project (note that it is dist-packages and not site-packages)
RUN echo /srv/kwj > /usr/local/lib/python3.5/dist-packages/paths.pth

RUN ln -s /usr/bin/nodejs /usr/bin/node

RUN npm install -g jspm

#WORKDIR /srv/kwj/keywordjournal/kwj_flask/static/jspm
#
#RUN jspm install

RUN rm /usr/bin/python
RUN ln -s /usr/bin/python3.5 /usr/bin/python

RUN ln -s /srv/kwj/scripts/setup.sh /usr/bin/setup-kwj
RUN ln -s /srv/kwj/scripts/runserver.sh /usr/bin/runserver-kwj