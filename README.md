# template-simple-fastify-node

## Access to mongo db

1. Should have installed [docker desktop](https://www.docker.com/products/docker-desktop/)
2. Need to check in terminal the next command(If you try after install, relaunch terminal)
```bash
docker-compose
```
or
```bash
docker compose
```
3. If command works, run ```docker-compose up``` or ```docker compose up```
4. After that you can use mongo db with next credentials

Host - localhost

Port - 27019

Username - root

Password - example

Or just use this connection string
```mongodb://root:example@localhost:27019/```

For stopping container with mongo you can use ```CTRL + C``` in an active terminal window where you run command above

Or just click on the stop button in the GUI interface of docker desktop


## The task

### Run via a docker database and connect to your application BEFORE you run listening server. Use for this function in ```src/initializers/connectToMongoose.js``` and in this func send connection string for mongo

### Create one mongo-model for user and save inside username, password, email and id. For password you should hash it via bcrypt

### Create three routes.

Validation rules for user.
Email should be email, min 6 symbols and max 40
Username should have min 2, and max 30
Password should have min 8, and max 20

#### The first should have ```/api/v1/user``` ```POST``` and we should save user inside mongo. We need to add schema validation. Need check if user with this email or username already exists in database.(username and email should be unique). If we save successful user, need send reply in 201 status and ```{ message: 'Successful created' }```
#### The second should have ```/api/v1/session``` ```POST``` and should return access token from JWT. We need add the same validation rules for user. We can send email/password or username/password.(please implement this in your schema, oneOf) Need check if we have this user and additionally if we have correct password. If both of them correct, we need send access token with 201 status and in format ```{token: 'token text'```. Use secret key for token ```'Secret key'```
#### The last rout should have ```/api/v1/protected``` ```GET``` and should check token in authorization header. We need to check to correct this token. If all is correct, send ```'Hello from protected'```. It should be a string, not JSON. Add checking header to validation(in schema property, use headers property and add validation)

Docs on [AJV](https://ajv.js.org/json-schema.html) can help you for schemas
