import type { HabitType } from './_store'
import { Show, createEffect, createSignal, onMount } from 'solid-js'
import { kinde } from './_auth'
import { habits, setHabits } from './_store'
import Habit from './Habit/Habit'

export default function Habits() {
  const [todaysHabits, setTodaysHabits] = createSignal<HabitType[]>([])
  const [loading, setLoading] = createSignal(true)

  const today = new Date()
  const todayString = today.toLocaleDateString('en-GB', { weekday: 'long' })
  const timeOfDay = parseInt(
    today.toLocaleTimeString('en-GB', { hour: '2-digit' })
  )
  const timeOfDayString =
    timeOfDay < 12 ? 'morning' : timeOfDay < 17 ? 'midday' : 'evening'

  createEffect(async () => {
    getTodaysHabits(habits())
  })

  const getTodaysHabits = async (habitsList: HabitType[]) => {
    const token = await kinde().getToken()
    setLoading(true)
    console.log('Getting habits')

    if (habitsList.length == 0) {
      const response = await fetch('/api/habits', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const responseHabits = (await response.json()).habits as HabitType[]
      console.log(responseHabits)
      if (!responseHabits || responseHabits?.length == 0) {
        setLoading(false)
        return
      }
      setHabits(responseHabits)
    }

    // Add habits to the list if they are due today
    for (const habit of habitsList) {
      if (!habit.days.includes(todayString.toLowerCase())) continue
      if (todaysHabits().find((h) => h.id === habit.id)) continue

      setTodaysHabits((prev) => [...prev, habit])
    }
    // Remove habits that are no longer in the main list (i.e deleted)
    setTodaysHabits((prev) =>
      prev.filter((habit) => habitsList.find((h) => h.id === habit.id))
    )

    setLoading(false)
  }

  const times = [
    { label: 'Morning', value: 'morning' },
    { label: 'Mid-Day', value: 'midday' },
    { label: 'Evening', value: 'evening' }
  ]

  return (
    <div class="h-screen w-full bg-gray-700 text-xl text-white">
      <Show
        when={!loading()}
        fallback={
          <div class="flex h-full w-full items-center justify-center">
            <div class="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-gray-900"></div>
          </div>
        }
      >
        <Show
          when={todaysHabits().length > 0}
          fallback={
            <Show
              when={habits().length > 0}
              fallback={
                <div class="flex h-full w-full items-center justify-center">
                  <p class="text-2xl">Create your first habit below...</p>
                </div>
              }
            >
              <div class="flex h-full w-full items-center justify-center">
                <p class="text-2xl">No habits for today!</p>
              </div>
            </Show>
          }
        >
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
                    'flex max-h-[30vh] flex-col gap-4 overflow-y-auto rounded-lg bg-gray-600 p-6 ' +
                    (open() ? '' : ' hidden')
                  }
                >
                  {todaysHabits().map((habit) => {
                    if (habit.time === time.value)
                      return <Habit habit={habit} />
                  })}
                </ul>
              </div>
            )
          })}
        </Show>
      </Show>
    </div>
  )
}
