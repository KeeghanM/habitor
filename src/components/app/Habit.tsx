import { createSignal } from 'solid-js'
import { kinde } from './_auth'
import type { HabitType } from './_store'

export default function Habit(props: { habit: HabitType }) {
  const [habit, setHabit] = createSignal(props.habit)
  const [completed, setCompleted] = createSignal(habit().completed as boolean)

  const handleComplete = async (e: Event) => {
    setCompleted((e.target as HTMLInputElement).checked)
    const valueChange = completed() ? 1 : -1
    setHabit((prev) => ({
      ...prev,
      streak: prev.streak! + valueChange
    }))

    const token = await kinde().getToken()
    const response = await fetch(`/api/habits/${habit().id}/updateCompletion`, {
      method: 'POST',
      headers: {
        contentType: 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ completed: completed(), today: new Date() })
    })
  }

  return (
    <li class="flex items-center gap-2">
      <p class="relative h-[45px] w-[45px] ">
        <span
          class={
            'absolute inset-0 ' +
            (habit().streak! > 0 ? 'text-orange-600' : 'text-gray-500')
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="45"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14c1 0 2.5 0 5-2.47c.27.773.5 1.604.5 2.47A7.5 7.5 0 0 1 12 23Z"
            />
          </svg>
        </span>
        <span class="absolute bottom-0.5 left-0 right-0 mx-auto w-fit pr-1 font-bold text-black">
          {habit().streak}
        </span>
      </p>
      <input
        type="checkbox"
        checked={completed()}
        onchange={(e) => handleComplete(e)}
      />
      <p>{habit().name}</p>
    </li>
  )
}
