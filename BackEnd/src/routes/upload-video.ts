import { fastifyMultipart } from '@fastify/multipart'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { prisma } from '../lib/prisma'

const pump = promisify(pipeline)

export async function uploadVideoRoutes(app: FastifyInstance) {
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 25 * 1024 * 1024,
    },
  })

  app.post('/videos', async (req, reply) => {
    const data = await req.file()

    if (!data) {
      return reply.status(400).send({
        message: 'File not found',
      })
    }

    const extension = path.extname(data.filename)

    if (extension !== '.mp3') {
      return reply.status(400).send({
        message: 'Invalid file extension, please upload a .mp3 file',
      })
    }

    const fileBaseName = path.basename(data.filename, extension)
    const fileName = `${fileBaseName}-${randomUUID()}${extension}`
    const uploadDestination = path.resolve(
      __dirname,
      '..',
      '..',
      'tmp',
      fileName,
    )
    await pump(data.file, fs.createWriteStream(uploadDestination))

    const video = await prisma.video.create({
      data: {
        name: data.fieldname,
        path: uploadDestination,
      },
    })

    reply.status(201).send()
  })
}
