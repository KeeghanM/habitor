import { Show, createSignal, onMount } from 'solid-js'
import {
  stats,
  statsRefresh,
  setStatsRefresh,
  setStats,
  habits
} from '../_store'
import { kinde } from '../_auth'
import Calendar from './calendar'

export default function Stats() {
  const [viewDate, setViewDate] = createSignal(new Date())
  const times = [
    { label: 'Morning', value: 'morning' },
    { label: 'Mid-Day', value: 'midday' },
    { label: 'Evening', value: 'evening' }
  ]

  onMount(async () => {
    if (stats.length == 0 || statsRefresh() == true) {
      const token = await kinde().getToken()
      const response = await fetch('/api/habits/stats', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const data = (await response.json()) as {
        [key: number]: { completion_date: string; value: string }[]
      }
      setStatsRefresh(false)
      setStats(data)
    }
  })

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(viewDate())
    if (direction == 'prev') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setMonth(newDate.getMonth() + 1)
    }
    setViewDate(newDate)
  }

  return (
    <div class="mx-auto max-w-screen-md px-6 pb-24 pt-6 text-xl text-white">
      <div class="flex items-center justify-center gap-4">
        <button
          class="w-fit  rounded-lg bg-gray-800 px-4 py-2 font-bold uppercase text-gray-300 transition-colors duration-300 hover:bg-gray-900 hover:shadow-lg"
          onClick={() => {
            changeMonth('prev')
          }}
        >
          Prev
        </button>
        <div class="flex-1 text-center text-xl ">
          {viewDate().toLocaleString('default', { month: 'long' })},{' '}
          {viewDate().getFullYear()}
        </div>
        <button
          class="w-fit  rounded-lg bg-gray-800 px-4 py-2 font-bold uppercase text-gray-300 transition-colors duration-300 hover:bg-gray-900 hover:shadow-lg"
          onClick={() => {
            changeMonth('next')
          }}
        >
          Next
        </button>
      </div>
      <Show when={Object.keys(stats()).length > 0}>
        {times.map((time) => {
          return (
            <div class="py-6">
              <h2 class="mb-4 text-3xl font-bold">{time.label}</h2>
              <div class="grid grid-cols-2 rounded-lg bg-gray-600 px-4 py-6 shadow-lg md:grid-cols-3">
                {habits().map((habit) => {
                  if (habit.time === time.value) {
                    return (
                      <div>
                        <p class="font-bold">{habit.name}</p>
                        <Calendar
                          stats={stats()[habit.id!]}
                          month={viewDate().getMonth() + 1}
                          year={viewDate().getFullYear()}
                        />
                      </div>
                    )
                  }
                })}
              </div>
            </div>
          )
        })}
      </Show>
    </div>
  )
}
