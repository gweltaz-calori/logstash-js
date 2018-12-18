# Logstash-js

It's like logstash but using javascript streams

## Usage

```bash
npm install logstash-js -g
```

You can now use the command

`logstash-js myconf.json`

## Inputs

### File Input

Props

`path` The full file path

```json
{
  "input": {
    "file": {
      "path": "D:/Development/logstash-js/dataset/myFile.csv"
    }
  },
  "output": {
    "debug": true
  }
}
```

### Http Input

Props

`path` The http server path

`method` The request method

`headers` The request headers

`user` The basic auth user

`password` The basic auth password

```json
{
  "input": {
    "http": {
      "path": "https://jsonplaceholder.typicode.com/todos",
      "method": "GET"
    }
  },
  "output": {
    "debug": true
  }
}
```

### Mongodb Input

Props

`user` The connection user

`password` The connection password

`host` The connection host

`port` The connection port

- Default value is `27017`

`database` The connection database

`collection` The collection to use for querying

`query` The full text query

`schedule` Call the query according to a schedule

- Optional
- Example `"schedule": { "every": "2s" }`

```json
{
  "input": {
    "mongodb": {
      "user": "",
      "password": "",
      "host": "localhost",
      "database": "mydatabase",
      "collection": "mycollection",
      "query": "{}",
      "schedule": {
        "every": "2s"
      }
    }
  },
  "output": {
    "debug": true
  }
}
```

### Mysql Input

Props

`user` The connection user

`password` The connection password

`host` The connection host

`port` The connection port

- Default value is `5432`

`database` The connection database

`query` The full text query

`schedule` Call the query according to a schedule

- Optional
- Example `"schedule": { "every": "2s" }`

```json
{
  "input": {
    "mysql": {
      "user": "root",
      "password": "",
      "host": "localhost",
      "database": "logstash",
      "query": "SELECT * FROM mytable"
    }
  },
  "output": {
    "debug": true
  }
}
```

### Pgsql Input

Props

`user` The connection user

`password` The connection password

`host` The connection host

`port` The connection port

- Default value is `5432`

`database` The connection database

`query` The full text query

`schedule` Call the query according to a schedule

- Optional
- Example `"schedule": { "every": "2s" }`

```json
{
  "input": {
    "pgsql": {
      "user": "root",
      "password": "",
      "host": "localhost",
      "database": "logstash",
      "query": "SELECT * FROM mytable"
    }
  },
  "output": {
    "debug": true
  }
}
```

## Transforms

### Csv Transform

Props

`delimiter` the csv delimiter

```json
{
  "input": {
    "file": {
      "path": "D:/Development/logstash-js/dataset/myFile.csv"
    }
  },
  "transform": {
    "csv": {
      "delimiter": ","
    }
  },
  "output": {
    "debug": true
  }
}
```

### Mutate Transform

Props

`rename_field` An object with each field to rename

- Example `"rename_field": { "_id": "id" }`

`remove_field` An array with a list of field to remove

- Example `"remove_field": ["name"]`

`add_field` An object with each field to add

- Example `"add_field": { "my_super_field": "aa" }`

```json
{
  "input": {
    "mongodb": {
      "user": "",
      "password": "",
      "host": "localhost",
      "database": "mydatabase",
      "collection": "mycollection",
      "query": "{}"
    }
  },
  "transform": {
    "mutate": {
      "rename_field": {
        "_id": "id"
      },
      "add_field": {
        "my_super_field": "aa"
      },
      "remove_field": ["name"]
    }
  },
  "output": {
    "debug": true
  }
}
```

## Outputs

### Debug Output

```json
{
  "output": {
    "debug": true
  }
}
```

### File Output

Props

`path` The full file output path

```json
{
  "output": {
    "file": {
      "path": "myOutput.csv"
    }
  }
}
```

### Elasticsearch Output

Props

`user` The connection user

`password` The connection password

`host` The connection host

`index` The index to output the data to

`protocol` The connection protocol

- Default `http`

`document_id` The document to index \_id

- Optional

```json
{
  "input": {
    "mysql": {
      "user": "root",
      "password": "",
      "host": "localhost",
      "database": "logstash",
      "query": "SELECT * FROM mytable"
    }
  },
  "output": {
    "debug": true,
    "elasticsearch": {
      "protocol": "http",
      "host": "localhost:9200",
      "user": "",
      "password": "",
      "index": "test_index",
      "document_id": "id"
    }
  }
}
```

## Environnement variables

You can use `${MY_VARIABLE}` to retrieve an environnement variable

```json
{
  "input": {
    "mysql": {
      "user": "${MYSQL_USER}",
      "password": "",
      "host": "${MYSQL_HOST}",
      "database": "logstash",
      "query": "SELECT * FROM mytable"
    }
  },
  "output": {
    "debug": true,
    "elasticsearch": {
      "protocol": "http",
      "host": "localhost:9200",
      "user": "",
      "password": "",
      "index": "test_index"
    }
  }
}
```
