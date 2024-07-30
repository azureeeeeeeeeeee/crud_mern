frontend -> axios, react-router-dom
backend -> express, MySQL, cors, nodemon, cookie-parser, jsonwebtoken, bcrypt

add app middleware

- express.json()
- cors({origin: [urls], methods: [http method], credentials: true})
- cookieParser()

create a db connection MySQL.createconnection({host, user, password, database})

create user credentials input (register, login, logout)

usestate tips
create a usestate with default value of an object ({email, username, password}).
to change on of the value on input change,
use destructuring (e => setCredential({...values, name: e.target.value}))

set the axios to automatically add the credentials when making a request

- axios.defaults.withCredentials = true

register endpoints

- create the sql to insert user credentials
- hash the password using bcrypt
  - set salt
  - bcrypt.hash(password, salt, function to return hashed password)
  - do the sql query in the db connection (db.query(sql, [values]))

login endpoints

- create the sql to get user credentials based on email
- execute the query
- compare the password in the query and the one in the request body (bcrypt.compare(req.body.password.toString(), data[0].password))
- if it caught an error, throw json error. else, return json success
- assign jwt token with jwt.sign({name}, "secret_key", {expiresIn: '1d})
- assign the token to the cookie (res.cookie('token', token))

creating a protected routes by checking if the user cookie is valid or not

- const token = jwt.verify(token, 'secret_key')
- the jwt verify will return err or decoded.
- access the name we sign earlier in the decoded.name

to implement logout, use
res.clearCookie('token');
