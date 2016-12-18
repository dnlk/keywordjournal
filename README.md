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

Run the server
```
runserver-kwj
```


### Immediate Todos

- Bundle the javascript dependencies, because it is taking forever to load the main page.
- Make the widget for adding a new argument to a keyword functional.
- Design and create widget for creating a new keyword.
- Create a way to modify posts.
- Create a simple view on the data, e.g. times used per day/month/year (or whatever is most appropriate).


### Lower priority Todos

- Standardize time zone?
- Break out website, api, resource management, (others?) into seperate components (services?)
