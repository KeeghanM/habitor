import { createSignal } from 'solid-js'
import { kinde } from './_auth'
import type { HabitType } from './_store'

export type HabitWithCompletion = HabitType & { completed: boolean }

export default function Habit(props: { habit: HabitWithCompletion }) {
  const { habit } = props
  const [completed, setCompleted] = createSignal(habit.completed as boolean)

  const handleComplete = async (e: Event) => {
    setCompleted((e.target as HTMLInputElement).checked)
    const token = await kinde().getToken()
    const response = await fetch(`/api/habits/${habit.id}/updateCompletion`, {
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
      <input
        type="checkbox"
        checked={completed()}
        onchange={(e) => handleComplete(e)}
      />
      <p>{habit.name}</p>
    </li>
  )
}
