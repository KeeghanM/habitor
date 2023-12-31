import type { HabitType } from './_store'
import { Show, createEffect, createSignal, onMount } from 'solid-js'
import { kinde } from './_auth'
import {
  habits,
  lastRefresh,
  openTimes,
  setHabits,
  setLastRefresh,
  setOpenTimes
} from './_store'
import Habit from './Habit/Habit'

export default function Habits() {
  const [todaysHabits, setTodaysHabits] = createSignal<HabitType[]>([])
  const [loading, setLoading] = createSignal(true)
  const oneHour = 1000 * 60 * 60
  let today: Date,
    todayString: string,
    timeOfDay: number,
    timeOfDayString: string

  const times = [
    { label: 'Morning', value: 'morning' },
    { label: 'Mid-Day', value: 'midday' },
    { label: 'Evening', value: 'evening' }
  ]

  const updateHabitsList = async () => {
    setLoading(true)
    await refreshHabitsList()
    await extractTodaysHabits()
    setLoading(false)
  }

  // Get all the time values/strings we need
  const updateTime = () => {
    today = new Date()
    todayString = today.toLocaleDateString('en-GB', { weekday: 'long' })
    timeOfDay = parseInt(today.toLocaleTimeString('en-GB', { hour: '2-digit' }))
    timeOfDayString =
      timeOfDay < 12 ? 'morning' : timeOfDay < 17 ? 'midday' : 'evening'

    // if the current time isn't in the open times, add it
    if (!openTimes().includes(timeOfDayString)) {
      setOpenTimes((prev) => [...prev, timeOfDayString])
    }
  }
  updateTime()

  // Whenever the habits list is updated, refresh the list of habits
  // also, do the same every hour
  createEffect(() => {
    updateHabitsList()
  })
  setInterval(() => {
    updateHabitsList()
    updateTime()
  }, oneHour)

  const refreshHabitsList = async () => {
    // Check if the habits list is empty or if it's been more than 24 hours since the last refresh
    if (
      habits().length == 0 ||
      lastRefresh().getTime() < Date.now() - oneHour * 24
    ) {
      const token = await kinde().getToken()
      const response = await fetch('/api/habits', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const responseHabits = (await response.json()).habits as HabitType[]
      if (!responseHabits || responseHabits?.length == 0) {
        setLoading(false)
        return
      }
      setHabits(responseHabits)
      setLastRefresh(new Date())
    }
  }

  const extractTodaysHabits = async () => {
    // Add new habits to the list if they are due today
    for (const habit of habits()) {
      // Check if the habit is due today
      if (!habit.days.includes(todayString.toLowerCase())) continue

      // Check if the habit is already in the list
      if (todaysHabits().find((h) => h.id === habit.id)) {
        // If it is, check if it has changed
        const existingHabit = todaysHabits().find((h) => h.id === habit.id)
        if (existingHabit !== habit) {
          // If it has, update it
          setTodaysHabits((prev) =>
            prev.map((h) => (h.id === habit.id ? habit : h))
          )
        }
        continue
      }

      // If it isn't, add it
      setTodaysHabits((prev) => [...prev, habit])
    }

    // Remove habits that are no longer in the main list (i.e deleted)
    setTodaysHabits((prev) =>
      prev.filter((habit) => habits().find((h) => h.id === habit.id))
    )
  }

  return (
    <Show
      when={!loading()}
      fallback={
        <div class="fixed bottom-0 flex h-full w-screen items-center justify-center">
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
              <div class="fixed bottom-0 flex h-full w-screen items-center justify-center">
                <p class="text-2xl text-white">Create your first habit...</p>
              </div>
            }
          >
            <div class="fixed bottom-0 flex h-full w-screen items-center justify-center">
              <p class="text-2xl text-white">No habits for today!</p>
            </div>
          </Show>
        }
      >
        <div class="mx-auto max-w-screen-md px-6 text-xl text-white ">
          {times.map((time) => {
            let ulRef: HTMLUListElement | undefined
            const [taskCount, setTaskCount] = createSignal(0)
            const [completedCount, setCompletedCount] = createSignal(0)
            const [open, setOpen] = createSignal(
              openTimes().includes(time.value)
            )
            return (
              <div class="py-6">
                <h2
                  onclick={() => {
                    ulRef?.classList.toggle('hidden')
                    setOpenTimes((prev) =>
                      prev.includes(time.value)
                        ? prev.filter((t) => t !== time.value)
                        : [...prev, time.value]
                    )
                  }}
                  class={
                    'group mb-2 flex w-fit cursor-pointer items-center gap-4 text-3xl font-bold uppercase transition-colors duration-150  hover:text-blue-500' +
                    (taskCount() == completedCount()
                      ? ' text-lime-500'
                      : ' text-white')
                  }
                >
                  <span class="font-bold text-blue-300 transition-colors duration-150 group-hover:text-blue-500">
                    {!open() ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path fill="currentColor" d="M19 12.998H5v-2h14z" />
                      </svg>
                    )}
                  </span>
                  {time.label}
                  <span>
                    ({completedCount()}/{taskCount()})
                  </span>
                </h2>
                <ul
                  ref={ulRef}
                  class={
                    'mt-2 flex max-h-[50vh] flex-col gap-4 overflow-y-auto rounded-lg bg-gray-600 px-4 py-6 shadow-lg ' +
                    (open() ? '' : ' hidden')
                  }
                >
                  {todaysHabits().map((habit) => {
                    if (habit.time === time.value) {
                      setTaskCount((prev) => prev + 1)
                      if (habit.completed) setCompletedCount((prev) => prev + 1)

                      return (
                        <Habit
                          habit={habit}
                          updateCompleted={setCompletedCount}
                        />
                      )
                    }
                  })}
                </ul>
              </div>
            )
          })}
        </div>
      </Show>
    </Show>
  )
}
