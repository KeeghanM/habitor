import { createSignal } from 'solid-js'

export type HabitType = {
  id?: number
  name: string
  type: string
  time: string
  days: string[]
  completed?: boolean
  streak?: number
}
export const [habits, setHabits] = createSignal<HabitType[]>([])
