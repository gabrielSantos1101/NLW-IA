import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { Button } from './components/ui/button'
import { Separator } from './components/ui/separator'

export function App() {
  return (
    <div className="flex flex-col h-screen">
      <div className="px-4 py-2 flex justify-between border-b">
        <h1 className="text-xl font-bold">transcription.ai</h1>
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
          <textarea className="w-full h-1/2 bg-primary/5 text-muted-foreground rounded-sm p-4 resize-none" />
          <textarea
            className="w-full h-1/2 bg-primary/5 rounded-sm p-4 resize-none outline-none"
            readOnly
          />
          <p className="mt-2">
            Remenber: you can use a variable as a {'transcription 🔑'} on your
            prompt for add content on the transcription to video selected.
          </p>
        </div>
        <aside className="w-72">estou aqui</aside>
      </main>
    </div>
  )
}
