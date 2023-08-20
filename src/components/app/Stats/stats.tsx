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
    <div class="mx-auto max-w-screen-md px-6 pt-6 text-xl text-white">
      <div class="mb-6 flex gap-4">
        <button
          class="w-fit  rounded-lg bg-gray-800 px-4 py-2 font-bold uppercase text-gray-300 transition-colors duration-300 hover:bg-gray-900 hover:shadow-lg"
          onClick={() => {
            changeMonth('prev')
          }}
        >
          Prev
        </button>
        <div class="flex-1 text-center">
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
        <div class="grid grid-cols-2 md:grid-cols-3">
          {habits().map((habit) => {
            return (
              <div>
                <h2 class="text-2xl font-bold">{habit.name}</h2>
                <Calendar
                  stats={stats()[habit.id!]}
                  month={viewDate().getMonth() + 1}
                  year={viewDate().getFullYear()}
                />
              </div>
            )
          })}
        </div>
      </Show>
    </div>
  )
}
