import { createSignal } from 'solid-js'
import { kinde } from '../_auth'
import type { HabitType } from '../_store'
import Delete from './Delete'

export default function Habit(props: { habit: HabitType }) {
  const [habit, setHabit] = createSignal(props.habit)
  const [completed, setCompleted] = createSignal(habit().completed as boolean)

  const fireMin = 5

  const handleCheck = async (e: Event) => {
    setCompleted((e.target as HTMLInputElement).checked)
    handleComplete(undefined)
  }
  const handleCount = async (e: Event) => {
    const countValue = (e.target as HTMLInputElement).valueAsNumber
    setCompleted(countValue > 0)
    handleComplete(countValue.toString())
  }
  const handleText = async (e: Event) => {
    const textValue = (e.target as HTMLInputElement).value
    setCompleted(textValue.length > 0)
    handleComplete(textValue)
  }

  const handleComplete = async (value: string | undefined) => {
    const streakChange =
      completed() != habit().completed ? (completed() ? 1 : -1) : 0
    setHabit((prev) => ({
      ...prev,
      streak: prev.streak! + streakChange,
      completed: completed(),
      value: value || prev.value
    }))

    const token = await kinde().getToken()
    const response = await fetch(`/api/habits/${habit().id}/updateCompletion`, {
      method: 'POST',
      headers: {
        contentType: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ completed: completed(), today: new Date(), value })
    })
  }

  return (
    <li class="flex gap-2 border-b border-gray-700 pb-2">
      <p class="relative flex h-[45px] w-[45px] items-center justify-center text-center">
        <span
          class={
            'absolute inset-0 ' +
            (habit().completed
              ? habit().streak! >= fireMin
                ? 'text-orange-600'
                : 'text-lime-500'
              : 'text-gray-500')
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="45"
            viewBox="0 0 24 24"
          >
            {habit().streak! >= fireMin ? (
              <path
                fill="currentColor"
                d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14c1 0 2.5 0 5-2.47c.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23Z"
              />
            ) : (
              <path
                fill="currentColor"
                d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20Zm0-8Z"
              />
            )}
          </svg>
        </span>
        <span
          class={
            'z-20 font-bold leading-none text-white' +
            (habit().streak! >= fireMin ? ' pt-3' : '')
          }
        >
          {habit().streak}
        </span>
      </p>
      <div class="flex flex-col gap-2">
        <label
          class={
            'text-lg font-semibold ' +
            (habit().type === 'check'
              ? 'cursor-pointer transition-colors duration-300 hover:text-lime-300'
              : 'cursor-default') +
            (habit().completed ? ' text-lime-500' : ' text-white')
          }
          for={(habit().id || 0).toString()}
        >
          {habit().name}
        </label>
        {habit().type === 'check' && (
          <input
            id={(habit().id || 0).toString()}
            type="checkbox"
            checked={completed()}
            onchange={(e) => handleCheck(e)}
            class="hidden"
          />
        )}
        {habit().type === 'count' && (
          <input
            id={(habit().id || 0).toString()}
            type="number"
            value={habit().value}
            onchange={(e) => handleCount(e)}
            min={0}
            max={1000}
            class="block w-24  rounded-lg border border-gray-600 bg-gray-700  p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        )}
        {habit().type === 'text' && (
          <textarea
            id={(habit().id || 0).toString()}
            rows={4}
            value={habit().value ? habit().value : ''}
            onchange={(e) => handleText(e)}
            class="block rounded-lg border border-gray-600 bg-gray-700  p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
          />
        )}
      </div>

      <Delete habit={habit()} />
    </li>
  )
}
