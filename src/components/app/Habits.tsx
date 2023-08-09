import type { HabitWithCompletion } from './Habit'
import { createSignal, onMount } from 'solid-js'
import { kinde } from './_auth'
import { setHabits } from './_store'
import Habit from './Habit'

export default function Habits() {
  const [todaysHabits, setTodaysHabits] = createSignal<HabitWithCompletion[]>(
    []
  )

  const today = new Date()
  const todayString = today.toLocaleDateString('en-GB', { weekday: 'long' })
  const timeOfDay = parseInt(
    today.toLocaleTimeString('en-GB', { hour: '2-digit' })
  )
  const timeOfDayString =
    timeOfDay < 12 ? 'morning' : timeOfDay < 17 ? 'midday' : 'evening'

  onMount(async () => {
    const token = await kinde().getToken()
    const response = await fetch('/api/habits', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const habits = (await response.json()).habits
    setHabits(habits)

    for (const habit of habits) {
      if (!habit.days.includes(todayString.toLowerCase())) continue

      const response = await fetch(`/api/habits/${habit.id}/completionStatus`, {
        method: 'POST',
        headers: {
          contentType: 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ today })
      })
      const completed = (await response.json()).completed
      habit.completed = completed
      setTodaysHabits((prev) => [...prev, habit])
    }
  })

  const times = [
    { label: 'Morning', value: 'morning' },
    { label: 'Mid-Day', value: 'midday' },
    { label: 'Evening', value: 'evening' }
  ]

  return (
    <div class="h-screen w-full bg-gray-700 text-xl text-white">
      {times.map((time) => {
        let ulRef: HTMLUListElement | undefined
        const [open, setOpen] = createSignal(timeOfDayString === time.value)
        return (
          <div class="px-12 py-6">
            <h2 class="mb-2 flex items-center gap-4 text-3xl font-bold uppercase">
              {time.label}
              <span
                class="cursor-pointer font-bold text-blue-300 transition-colors duration-300 hover:text-blue-500 "
                onclick={() => {
                  ulRef?.classList.toggle('hidden')
                  setOpen(!open())
                }}
              >
                {!open() ? '+' : '-'}
              </span>
            </h2>
            <ul
              ref={ulRef}
              class={
                'max-h-[30vh] overflow-y-auto rounded-lg bg-gray-600 p-6' +
                (open() ? '' : ' hidden')
              }
            >
              {todaysHabits().map((habit) => {
                if (habit.time === time.value) return <Habit habit={habit} />
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
