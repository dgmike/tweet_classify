# Tweet classify

Tweet classify is a project made for fetch and classify tweets based on required search terms or hash tags. All the
information is provided on a friendly web interface.

# Docker images used by project

- [mongo](https://hub.docker.com/_/mongo) for store data
- [rabbitmq](https://hub.docker.com/_/rabbitmq) to manage message between services
- [python](https://hub.docker.com/_/python) to fetch tweets from twitter.com
- [node](https://hub.docker.com/_/node) to classify and sumariza information and to run frontend interface
- [gradle](https://hub.docker.com/_/gradle) to create accessible API
