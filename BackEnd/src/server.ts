import fastifyCors from '@fastify/cors'
import fastify from 'fastify'
import { createTranscriptionRoutes } from './routes/create-transcription'
import { generateAiCompletionRoute } from './routes/generate-ai-transcription'
import { getAllPromptsRoutes } from './routes/get-all-prompts'
import { uploadVideoRoutes } from './routes/upload-video'

const app = fastify()
const port = 3333

app.register(fastifyCors, {
  origin: '*',
})
app.register(getAllPromptsRoutes)
app.register(uploadVideoRoutes)
app.register(createTranscriptionRoutes)
app.register(generateAiCompletionRoute)

app
  .listen({
    port,
  })
  .then(() => {
    console.log(`HTTP server running! Port: ${port}`)
  })
