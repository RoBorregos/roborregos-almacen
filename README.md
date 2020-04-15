1. Clone the project repository on your local machine.

	SSH:

	```bash
	$ git clone git@github.com:gallosanchez23/roborregos-web.git
	```

	or HTTPS:
	```bash
	$ git clone https://github.com/gallosanchez23/roborregos-web.git
	```

2. You will need to create the node_modules directory needed to run react apps.

	```bash
	$ yarn install
	```

3. Create the Docker image.

	`plis`:

	```bash
	$ plis build
	```

	`docker-compose`:

	```bash
	$ docker-compose build
	```

### Running the stack for development

In your terminal, run:

`plis`:

```bash
$ plis start frontend-web && plis attach frontend-web
```

`docker-compose`:

```bash
$ docker-compose up
```

This command will start the frontend application and display the logs on your terminal. Use `Ctrl + C` to exit the logs and turn the application down. Otherwise, in order to run the service in the background, just run:

`plis`:

```bash
$ plis start frontend-web
```

`docker-compose`:

```bash
$ docker-compose up -d
```

If the service is already running, you can run the command `plis attach frontend-web` to attach current service's logs.

***NOTE: You can allways run `plis run frontend-web bash` or `docker-compose run frontend-web bash` commands to enter the container's console.***

### Stopping services

In order to stop `roborregos-frontend-web` entirely you can run:

`plis`:

```bash
$ plis stop
```

`docker-compose`:

```bash
$ docker-compose stop
```

If you want to stop the services and remove the containers:

`plis`:

```bash
$ plis down
```

`docker-compose`:

```bash
$ docker-compose down
```

If you only want to stop one service in particular, you can specify it with the following command:

`plis`:

```bash
$ plis stop frontend-web
```

`docker-compose`:

```bash
$ docker-compose stop frontend-web
```
