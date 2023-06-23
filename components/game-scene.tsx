import useModal from '@/hooks/useModal'
import { useAppStore } from '@/stores/app'
import { Result, Results } from '@/types/result'
import { Select } from '@/types/select'
import { Elusiv } from '@elusiv/sdk'
import { useEffect, useState } from 'react'
import CursorSelect from './cursor-select'

const SELECTS: Select[] = ['scissors', 'hammer', 'bag']
const DEFAULT_RESULTS: Result[] = ['not-yet', 'not-yet', 'not-yet', 'not-yet', 'not-yet']

interface GameSceneProps {
  elusiv: Elusiv | undefined
}

export default function GameScene({ elusiv }: GameSceneProps) {
  const [userSelected, setUserSelected] = useState<Select>('default')
  const [computerSelected, setComputerSelected] = useState<Select>('default')
  const [results, setResults] = useState<Results>(DEFAULT_RESULTS)
  const [round, setRound] = useState(0)
  const [loading, setFinalResult] = useAppStore((state) => [state.loading, state.setResult])
  const setIsOpen = useModal((state) => state.setIsOpen)

  const pick = (select: Select) => {
    if (round < 5) {
      setUserSelected(select)
      setComputerSelected(SELECTS[Math.floor(Math.random() * SELECTS.length)])
    }
  }

  useEffect(() => {
    if (round <= 5) {
      // Rule for user win
      if (
        (userSelected === 'bag' && computerSelected === 'hammer') ||
        (userSelected === 'hammer' && computerSelected === 'scissors') ||
        (userSelected === 'scissors' && computerSelected === 'bag')
      ) {
        setResults(results.map((item, i) => (i === round ? 'win' : item)))
        setRound(round + 1)
      }

      // Rule for computer win
      if (
        (computerSelected === 'bag' && userSelected === 'hammer') ||
        (computerSelected === 'hammer' && userSelected === 'scissors') ||
        (computerSelected === 'scissors' && userSelected === 'bag')
      ) {
        setResults(results.map((item, i) => (i === round ? 'lose' : item)))
        setRound(round + 1)
      }
      // Rule for draw
      if (
        (computerSelected === 'bag' && userSelected === 'bag') ||
        (computerSelected === 'hammer' && userSelected === 'hammer') ||
        (computerSelected === 'scissors' && userSelected === 'scissors')
      ) {
        setResults(results.map((item, i) => (i === round ? 'draw' : item)))
        setRound(round + 1)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSelected, computerSelected])

  useEffect(() => {
    if (round === 5 && !results.includes('not-yet')) {
      const winRounds = results.filter((element) => element === 'win').length
      const loseRounds = results.filter((element) => element === 'lose').length
      const drawRounds = results.filter((element) => element === 'draw').length

      if (winRounds > loseRounds) setFinalResult('win')
      if (winRounds < loseRounds) setFinalResult('lose')
      if (winRounds === loseRounds) setFinalResult('draw')
      if (drawRounds === 5) setFinalResult('draw')

      setResults(DEFAULT_RESULTS)
      setRound(0)
      setUserSelected('default')
      setComputerSelected('default')
      setIsOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, results])

  return (
    <>
      {elusiv && (
        <div className='w-[80%] aspect-[1/1] rounded-3xl bg-base-100 mt-5 p-5 relative'>
          <div className='absolute flex top-5 gap-1 left-[50%] translate-x-[-50%]'>
            {results.map((res, id) => (
              <>
                {
                  {
                    'not-yet': <div key={id} className='badge badge-neutral badge-sm'></div>,
                    win: <div key={id} className='badge badge-success badge-sm'></div>,
                    lose: <div key={id} className='badge badge-error badge-sm'></div>,
                    draw: <div key={id} className='badge badge-warning badge-sm'></div>,
                  }[res]
                }
              </>
            ))}
          </div>

          <div className='flex w-full h-full justify-between'>
            <div className=' p-4 flex items-center justify-center'>
              <CursorSelect id={userSelected} isComputer={false} />
            </div>
            <div className=' p-4 flex items-center justify-center'>
              <CursorSelect id={computerSelected} isComputer />
            </div>
          </div>

          <div className='flex absolute bottom-5 gap-3 left-[50%] translate-x-[-50%]'>
            <button
              className='btn btn-secondary btn-square text-xl'
              disabled={loading}
              onClick={() => pick('scissors')}>
              ✌️
            </button>
            <button className='btn btn-secondary btn-square text-xl' disabled={loading} onClick={() => pick('hammer')}>
              ✊
            </button>
            <button className='btn btn-secondary btn-square text-xl' disabled={loading} onClick={() => pick('bag')}>
              🖐
            </button>
          </div>
        </div>
      )}
    </>
  )
}
