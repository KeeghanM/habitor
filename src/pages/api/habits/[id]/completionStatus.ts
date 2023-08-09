import type { APIRoute } from 'astro'
import GetUserId from '../../_auth'
import { DB } from '../../_database'

export const post: APIRoute = async ({ params, request }) => {
  try {
    const habit_id = params.id
    if (!habit_id) {
      return new Response(JSON.stringify({ error: 'Missing Habit Id' }), {
        status: 400
      })
    }

    const { today } = await request.json()
    if (!today) {
      return new Response(JSON.stringify({ error: 'Missing Today' }), {
        status: 400
      })
    }

    const user_id = await GetUserId(request)
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401
      })
    }

    const dateString = today.split('T')[0]
    const response = await DB.execute(
      `SELECT * FROM 
        completions c 
        JOIN habits h ON c.habit_id = h.id
    WHERE 
        c.habit_id = ? 
        AND c.completion_date = ?
        AND h.user = ?
        `,
      [habit_id, dateString, user_id]
    )
    const completed = response.rows.length > 0

    return new Response(JSON.stringify({ completed }), {
      status: 200
    })
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ error }), {
      status: 500
    })
  }
}
