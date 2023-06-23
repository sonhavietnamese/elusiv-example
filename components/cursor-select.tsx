import { Select } from '@/types/select'

interface SelectProps {
  id: Select
  isComputer: boolean
}

export default function CursorSelect({ id, isComputer }: SelectProps) {
  return (
    <div className={`flex w-52 h-52 justify-center items-center ${isComputer ? ' scale-x-[-1]' : ''}`}>
      <span className='text-[80px]'>
        {
          {
            scissors: '✌️',
            hammer: '✊',
            bag: '🖐',
            default: '🤌',
          }[id]
        }
      </span>
    </div>
  )
}
