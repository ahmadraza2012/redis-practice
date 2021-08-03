#### Redis Practice Notes

To install Redis
```
$ sudo apt update
$ sudo apt install redis-server
```

To check Redis status

```
$ sudo systemctl status redis
```

Testing some Key value pairs on redis-cli

```
$ redis-cli
$ set test ahmadraza2012
$ get test
```

To Remove all data from Redis Cache

```
$ FLUSHALL
```

