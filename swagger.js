import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Authentication API',
			description: "Api para testear la autenticación de usuarios.",
			contact: {
				name: "Gustavo Brand",
				email: "no-reply@gustavo-brand.com",
				url: "https://github.com/Gustavo998/auth-api"
			},
			version: '1.0.0',
		},
		components: {
			securitySchemes: {
				sessionAuth: {
					type: 'apiKey',
					in: 'header',
					name: 'X-SESSION-TOKEN'
				},
			},
		},
		security: [
			{
				bearerToken: [],
			},
		],
		servers: [
			{
				url: "http://localhost:3000",
				description: "Host"
			},
		]
	},
	// looks for configuration in specified directories
	apis: ['./user-repository.js', './post-repository.js'],
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs(app, port) {
	// Swagger Page
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
	// Documentation in JSON format
	app.get('/docs.json', (req, res) => {
		res.setHeader('Content-Type', 'application/json')
		res.send(swaggerSpec)
	})
}
export default swaggerDocs