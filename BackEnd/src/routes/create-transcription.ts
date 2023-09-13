import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function createTranscriptionRoutes(app: FastifyInstance) {
  app.post('/videos/:videoId/transcription', async (req) => {
    const paramsSchema = z.object({
      videoId: z.string().uuid(),
    })
    const { videoId } = paramsSchema.parse(req.params)
    const badySchema = z.object({
      prompt: z.string(),
    })

    const { prompt } = badySchema.parse(req.body)

    const video = await prisma.video.findUnique({
      where: {
        id: videoId,
      },
    })

    const videoPath = video?.path

    return { prompt, videoId, videoPath }
  })
}
