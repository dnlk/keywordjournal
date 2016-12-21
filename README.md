# keywordjournal

### Setting up


- Have sqlite3 installed
- Have VirtualBox installed
- Have Vagrant installed

Doing the following should be sufficient to build the dependencies:
```
vagrant up
```

Step into the Vagrant provisioned VM:
```
vagrant ssh
```

Set up the database (if it is not already built) - this will probably wipe it if it exists.
```
setup-kwj
```

Run the server.
```
runserver-kwj
```

The javascript dependencies need to be bundled, or else the main page will load very slow.
```
cd keywordjournal/kwj_flask/static/jspm  # It is important to run it from this directory!
jspm bundle ../kwj_react/react-app ../jspm_build/build.js
```


### Immediate Todos

- Make "New Keyword" button functional
- Create a way to modify posts.
- Logout
- Create a simple view on the data, e.g. times used per day/month/year (or whatever is most appropriate).


### Lower priority Todos

- Style it so it is nice on mobile
- Deploy it
- Standardize time zone?
- Break out website, api, resource management, (others?) into seperate components (services?)
- Delete keyword args
