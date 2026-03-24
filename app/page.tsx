import { Button } from "@/components/ui/button"
export default function Home() {
  return (
    <div className="flex gap-1">
      <Button>
        Primary
      </Button>
      <Button variant='secondary'>
        Secondary
      </Button>
      <Button variant='outline'>
        Outline
      </Button>
      <Button variant='ghost'>
        Ghost
      </Button>
      <Button variant='destructive'>
        Destructive
      </Button>
      <Button variant='link'>
        Link
      </Button>
    </div>   
  )
}