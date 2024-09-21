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
	/**
	 * @openapi
	 * '/api/register':
	 *  post:
	 *     tags:
	 *     - User
	 *     summary: Registrar usuarios
	 *     requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *           schema:
	 *            type: object
	 *            required:
	 *              - username
	 *              - password
	 *            properties:
	 *              username:
	 *                type: string
	 *                default: cami2024 
	 *              password:
	 *                type: string
	 *                default: mipassword
	 *     responses:
	 *      200:
	 *        description: Success
	 *      500:
	 *        description: Server Error
	 *      422:
	 *        description: Unprocessable entity
	 */
	static async create({ username, password }) {
		Validation.username(username)
		Validation.password(password)

		const user = User.findOne({ username })
		if (user) throw new Error('422:El username ya existe')

		const id = crypto.randomUUID()
		const hashedPassword = bcrypt.hashSync(password, 10)

		User.create({
			_id: id,
			username,
			password: hashedPassword
		}).save()

		return id
	}

	/**
	 * @openapi
	 * '/api/login':
	 *  post:
	 *     tags:
	 *     - User
	 *     summary: Iniciar sesión con un usuario
	 *     requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *           schema:
	 *            type: object
	 *            required:
	 *              - username
	 *              - password
	 *            properties:
	 *              username:
	 *                type: string
	 *                default: cami2024 
	 *              password:
	 *                type: string
	 *                default: mipassword
	 *     responses:
	 *      200:
	 *        description: Success
	 *      500:
	 *        description: Server Error
	 *      401:
	 *        description: Unauthorized
	 *      422:
	 *        description: Unprocessable entity
	 */
	static async login({ username, password }) {
		Validation.username(username)
		Validation.password(password)

		const user = User.findOne({ username })
		if (!user) throw new Error('401:El username no existe')

		const isValid = bcrypt.compareSync(password, user.password)
		if (!isValid) throw new Error('401:El password es incorrecto')

		return {
			_id: user._id,
			username: user.username
		}
	}

	/**
 * @openapi
 * /api/protected:
 *   get:
 *     tags:
 *       - User
 *     summary: Validar que el usuario esté logueado
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server Error
 */
	static async getUser({ token }) {
		return token
	}
}

class Validation {
	static username(username) {
		if (typeof username !== 'string') throw new Error('422:El username debe ser un string')
		if (username.length < 3) throw new Error('422:El username debe contener al menos 3 caracteres')
	}

	static password(password) {
		if (typeof password !== 'string') throw new Error('422:El password debe ser un string')
		if (password.length < 6) throw new Error('422:El password debe contener al menos 6 caracteres')
	}
}