import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { useCompletion } from 'ai/react'
import { Wand2 } from 'lucide-react'
import { useState } from 'react'
import { PromptSelect } from './PromptSelect'
import { Button } from './components/ui/button'
import { Label } from './components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select'
import { Separator } from './components/ui/separator'
import { Slider } from './components/ui/slider'
import { Textarea } from './components/ui/textarea'
import { VideoInputForm } from './components/videoInputForm'

export function App() {
  const [temperature, setTemperature] = useState(0.5)
  const [videoId, setVideoId] = useState<string | null>(null)

  const {
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
  } = useCompletion({
    api: 'http://localhost:3333/ai/complete',
    body: {
      videoId,
      temperature,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return (
    <div className="flex flex-col h-screen">
      <div className="px-4 py-2 flex justify-between sticky top-0 bg-inherit border-b">
        <h1 className="text-xl font-bold">
          Transcription<span className="text-violet-600">.ai</span>
        </h1>
        <div className="items-center flex gap-3">
          <span className="text-sm text-muted-foreground">
            developmed by{' '}
            <a
              href="https://github.com/gabrielsantos1101"
              className="text-violet-600 hover:text-violet-500"
              target="_blank"
              rel="noreferrer"
            >
              Gabriel Santos
            </a>
          </span>

          <Separator orientation="vertical" />

          <Button>
            <GitHubLogoIcon className="mr-2" />
            Github
          </Button>
        </div>
      </div>
      <main className="flex p-6 gap-6 flex-1">
        <div className="flex-1 flex flex-col gap-3">
          <Textarea
            placeholder="inserir a prompt to IA"
            value={input}
            onChange={handleInputChange}
            className="w-full h-1/2 bg-primary/5 text-muted-foreground leading-relaxed placeholder:text-slate-500 rounded-sm p-4 resize-none"
          />
          <Textarea
            placeholder="Result of transcription"
            className="w-full h-1/2 bg-primary/5 leading-relaxed placeholder:text-slate-500 rounded-sm p-4 resize-none"
            value={completion}
            readOnly
          />
          <p className="mt-2 text-muted-foreground">
            Remember: You can use a variable as a{' '}
            <code className="text-violet-600">transcription 🔑</code> on your
            prompt to add content on the transcription to the video selected.
          </p>
        </div>
        <aside className="w-80 space-y-6">
          <VideoInputForm onVideoUploaded={setVideoId} />
          <Separator />

          <form className="space-y-6" onSubmit={handleSubmit}>
            <PromptSelect onPromptSelected={setInput} />
            <div className="space-y-2">
              <Label>Model</Label>
              <Select defaultValue="gpt-3.5" disabled>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-3.5">GPT 3.5-turbo 16k</SelectItem>
                </SelectContent>
              </Select>
              <span className="block text-xs text-muted-foreground italic">
                You can customize this option soon
              </span>
            </div>

            <Separator />

            <div className="space-y-4">
              <Label>Temperature</Label>
              <Slider
                min={0}
                max={1}
                step={0.1}
                value={[temperature]}
                onValueChange={(value) => setTemperature(value[0])}
              />
              <span className="block text-xs text-muted-foreground italic">
                Higher values will make the transcription less accurate
              </span>
            </div>

            <Separator />

            <Button className="flex w-full gap-2" disabled={isLoading}>
              Execult
              <Wand2 className="w-4 h-4" />
            </Button>
          </form>
        </aside>
      </main>
    </div>
  )
}
