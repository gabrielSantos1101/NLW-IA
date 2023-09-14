import { api } from '@/lib/axios'
import { getFFmpeg } from '@/lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { Label } from '@radix-ui/react-label'
import { Separator } from '@radix-ui/react-separator'
import { Clapperboard, UploadCloud } from 'lucide-react'
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success'

interface VideoInputFormProps {
  onVideoUploaded: (id: string) => void
}

const statusMessages = {
  converting: 'Converting...',
  generating: 'Generating...',
  uploading: 'Uploading...',
  success: 'Success!',
}

export function VideoInputForm(props: VideoInputFormProps) {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('waiting')
  const promptInputRef = useRef<HTMLTextAreaElement>(null)
  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) {
      // eslint-disable-next-line no-useless-return
      return
    }

    const selectedFile = files[0]
    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File) {
    console.log('Convert started.')

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('progress', (progress) => {
      console.log('Convert progress: ' + Math.round(progress.progress * 100))
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mp3' })
    const audioFile = new File([audioFileBlob], 'output.mp3', {
      type: 'audio/mpeg',
    })

    console.log('Convert finished.')

    return audioFile
  }

  async function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if (!videoFile) {
      // eslint-disable-next-line no-useless-return
      return
    }

    // video to audio converter
    setStatus('converting')

    const audioFile = await convertVideoToAudio(videoFile)

    const data = new FormData()

    data.append('file', audioFile)

    setStatus('uploading')

    const response = await api.post('/videos', data)

    const videoId = response.data.video.id
    console.log(videoId)

    setStatus('generating')

    await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    })

    setStatus('success')

    props.onVideoUploaded(videoId)
  }

  const previewUrl = useMemo(() => {
    if (!videoFile) {
      return null
    }
    return URL.createObjectURL(videoFile)
  }, [videoFile])

  return (
    <form onSubmit={handleUpload} className="space-y-6 w-full">
      <label className="w-full relative border-dotted border-2 flex aspect-video text-sm items-center gap-4 cursor-pointer hover:text-violet-500 hover:border-violet-500 justify-center rounded-md border-muted-foreground ">
        {previewUrl ? (
          <video
            src="{previewUrl}"
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <Clapperboard className="text-xl" /> upload video
          </>
        )}
        <input
          type="file"
          name="video"
          accept="video/mp4"
          className="sr-only"
          onChange={handleFileSelect}
        />
      </label>

      <Separator />

      <div>
        <Label className="text-gray-200 grid gap-4">
          Transcription prompt
          <Textarea
            ref={promptInputRef}
            placeholder="Include keywords mentioned on the video separated for comma ( , )"
            className="w-full min-h-[80px] bg-primary/5 leading-relaxed max-h-36 placeholder:text-slate-500 overflow-x-hidden rounded-sm p-4"
          />
        </Label>
      </div>
      <Button
        data-success={status === 'success'}
        disabled={status !== 'waiting'}
        type="submit"
        className="w-full flex gap-2 data-[success=true]:bg-emerald-400"
      >
        {status === 'waiting' ? (
          <>
            Uploading Video
            <UploadCloud className="w-4 h-4" />
          </>
        ) : (
          statusMessages[status]
        )}
      </Button>
    </form>
  )
}
