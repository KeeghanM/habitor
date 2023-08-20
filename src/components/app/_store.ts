import { createSignal } from 'solid-js'

export type HabitType = {
  id?: number
  name: string
  type: string
  time: string
  days: string[]
  completed?: boolean
  streak?: number
  value?: string
}
export const [habits, setHabits] = createSignal<HabitType[]>([])

export const [lastRefresh, setLastRefresh] = createSignal<Date>(new Date())

export const [openTimes, setOpenTimes] = createSignal<string[]>([])

export const [screen, setScreen] = createSignal<'stats' | 'habits'>('habits')

export type Stat = {
  id: number
  completion_date: string
  value: string
}
export const [stats, setStats] = createSignal<{
  [key: number]: { completion_date: string; value: string }[]
}>({})
export const [statsRefresh, setStatsRefresh] = createSignal(false)
