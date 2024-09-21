import express from "express"
import { PORT, SECRET_JWT_KEY } from './config.js'
import { UserRepository } from "./user-repository.js"
import jwt from 'jsonwebtoken'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
	res.send('Bienvenido al auth-api');
})

app.post('/api/login', async (req, res) => {
	const { username, password } = req.body
	try {
		const user = await UserRepository.login({ username, password })
		const token = jwt.sign({ id: user._id, username: user.username }, SECRET_JWT_KEY, {
			expiresIn: '1m'
		})
		res.send({ user, token })
	} catch (error) {
		res.status(401).send(error.message);
	}
})

app.post('/api/register', async (req, res) => {
	const { username, password } = req.body
	try {
		const id = await UserRepository.create({ username, password })
		res.send({ id })
	} catch (error) {
		res.status(500).send(error.message);
	}
})

app.get('/api/protected', (req, res) => {
	const token = req.header('X-SESSION-TOKEN');
	if (!token) {
		return res.status(403).send('Acceso no autorizado')
	}
	try {
		const data = jwt.verify(token, SECRET_JWT_KEY)
		return res.send(data)
	} catch (error) {
		res.status(500).send("Acceso no autorizado");
	}
})

app.listen(PORT, () => {
	console.log('server running on port ${PORT}')
})