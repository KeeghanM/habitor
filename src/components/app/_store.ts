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
