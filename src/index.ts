import "dotenv/config"

import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUI from "@fastify/swagger-ui"
import Fastify from "fastify"
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	ZodTypeProvider,
} from "fastify-type-provider-zod"
import z from "zod"

const app = Fastify({
	logger: true,
})

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: "NextCoach AI",
			description: "API NextCoach AI app",
			version: "0.0.1",
		},
		servers: [
			{
				description: "Localhost",
				url: "http://localhost/3000",
			},
		],
	},
	transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
	routePrefix: "/docs",
})

app.withTypeProvider<ZodTypeProvider>().route({
	method: "GET",
	url: "/",
	// Define your schema
	schema: {
		description: "Hello World",
		tags: ["Hello World"],
		response: {
			200: z.object({
				message: z.string(),
			}),
		},
	},
	handler: () => {
		return {
			message: "Hello World",
		}
	},
})

// Run the server!
try {
	await app.listen({ port: Number(process.env.PORT || 8081) })
} catch (err) {
	app.log.error(err)
	process.exit(1)
}
