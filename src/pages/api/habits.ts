import type { APIRoute } from 'astro'
import GetUserId from './_auth'
import { DB } from './_database'
import type { Habit } from '../../components/app/_store'

export const post: APIRoute = async ({ params, request }) => {
  try {
    const user_id = await GetUserId(request)
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401
      })
    }

    const { habit }: { habit: Omit<Habit, 'id'> } = await request.json()

    const days = habit.days.join(',')
    const response = await DB.execute(
      `INSERT INTO habits (user, name, type, time, days) VALUES (?, ?, ?, ?, ?)`,
      [user_id, habit.name, habit.type, habit.time, days]
    )
    const habitId = response.insertId
    const newHabit = { id: habitId, ...habit }

    return new Response(JSON.stringify({ habit: newHabit }), {
      status: 200
    })
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ error }), {
      status: 500
    })
  }
}
