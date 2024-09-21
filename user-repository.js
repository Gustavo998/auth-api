import DBLocal from "db-local"
import crypto from 'crypto'
import bcrypt from 'bcrypt'

const { Schema } = new DBLocal({ path: './db' })

const User = Schema('User', {
	_id: { type: String, required: true },
	username: { type: String, required: true },
	password: { type: String, required: true }
})

export class UserRepository {
	static async create({ username, password }) {
		Validation.username(username)
		Validation.password(password)

		const user = User.findOne({ username })
		if (user) throw new Error('El username ya existe')

		const id = crypto.randomUUID()
		const hashedPassword = bcrypt.hashSync(password, 10)

		User.create({
			_id: id,
			username,
			password: hashedPassword
		}).save()

		return id
	}

	static async login({ username, password }) {
		Validation.username(username)
		Validation.password(password)

		const user = User.findOne({ username })
		if (!user) throw new Error('El username no existe')

		const isValid = bcrypt.compareSync(password, user.password)
		if (!isValid) throw new Error('El password es incorrecto')

		return {
			_id: user._id,
			username: user.username
		}
	}
}

class Validation {
	static username(username) {
		if (typeof username !== 'string') throw new Error('El username debe ser un string')
		if (username.length < 3) throw new Error('El username debe contener al menos 3 caracteres')
	}

	static password(password) {
		if (typeof password !== 'string') throw new Error('El password debe ser un string')
		if (password.length < 6) throw new Error('El password debe contener al menos 6 caracteres')
	}
}