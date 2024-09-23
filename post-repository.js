import DBLocal from "db-local"
import crypto from "crypto"

const { Schema } = new DBLocal({ path: './db/posts' })

const Post = Schema('Post', {
	_id: { type: String, required: true },
	user_id: { type: String, required: true },
	title: { type: String, required: true },
	description: { type: String, required: true }
})

export class PostRepository {
	/**
	 * @openapi
	 * '/api/posts':
	 *  post:
	 *     tags:
	 *     - Post
	 *     summary: Crear un post
	 *     security:
	 *       - sessionAuth: []
	 *     requestBody:
	 *      required: true
	 *      content:
	 *        application/json:
	 *           schema:
	 *            type: object
	 *            required:
	 *              - title
	 *              - description
	 *            properties:
	 *              title:
	 *                type: string
	 *                default: post 
	 *              description:
	 *                type: string
	 *                default: mi descripcion post
	 *     responses:
	 *      200:
	 *        description: Success
	 *      500:
	 *        description: Server Error
	 *      422:
	 *        description: Unprocessable entity
	 */
	static async create({ title, description, user_id }) {
		Validation.title(title)
		Validation.description(description)

		const id = crypto.randomUUID()

		Post.create({
			_id: id,
			title,
			description,
			user_id
		}).save()

		return id
	}

	/**
 * @openapi
 * /api/posts:
 *   get:
 *     tags:
 *       - Post
 *     summary: Obtener los posts de un usuario logeado
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
	static async getByUserId({ user_id }) {
		return Post.find({ user_id })
	}
}

class Validation {
	static title(title) {
		if (typeof title !== 'string') throw new Error('422:El title debe ser un string')
		if (title.length < 3) throw new Error('422:El title debe contener al menos 3 caracteres')
	}

	static description(description) {
		if (typeof description !== 'string') throw new Error('422:El description debe ser un string')
		if (description.length < 6) throw new Error('422:El description debe contener al menos 6 caracteres')
	}
}