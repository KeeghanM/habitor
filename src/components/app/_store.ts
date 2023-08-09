import { createSignal } from 'solid-js'

export type Habit = {
  id: number
  name: string
  type: string
  time: string
  days: string[]
}
export const [habits, setHabits] = createSignal<Habit[]>([])
