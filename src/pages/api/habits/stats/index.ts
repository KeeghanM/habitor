import type { APIRoute } from 'astro'
import GetUserId from '../../_auth'
import { DB } from '../../_database'
import type { HabitType, Stat } from '../../../../components/app/_store'

export const get: APIRoute = async ({ params, request }) => {
  try {
    const user_id = await GetUserId(request)
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401
      })
    }

    const response = await DB.execute(
      `select h.id,c.completion_date,c.value from completions c join habits h on h.id = c.habit_id where h.active = 1 and h.user = ? order by h.id`,
      [user_id]
    )

    const stats: {
      [key: number]: { completion_date: string; value: string }[]
    } = {}
    for (const stat of response.rows as Stat[]) {
      if (!stats[stat.id]) stats[stat.id] = []
      stats[stat.id].push({
        completion_date: stat.completion_date,
        value: stat.value
      })
    }

    return new Response(JSON.stringify(stats), {
      status: 200
    })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500
    })
  }
}
