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

    const { today, completed }: { today: string; completed: boolean } =
      await request.json()
    if (!today) {
      return new Response(JSON.stringify({ error: 'Missing Today' }), {
        status: 400
      })
    }
    if (completed === undefined) {
      return new Response(JSON.stringify({ error: 'Missing Completed' }), {
        status: 400
      })
    }

    const user_id = await GetUserId(request)
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401
      })
    }

    // check that the habit belongs to the user
    const habit = await DB.execute(
      `SELECT * FROM habits WHERE id = ? AND user = ?`,
      [habit_id, user_id]
    )
    if (!habit) {
      return new Response(JSON.stringify({ error: 'Habit not found' }), {
        status: 404
      })
    }

    const dateString = today.split('T')[0]
    let response: any
    if (completed) {
      response = await DB.execute(
        `INSERT INTO completions (habit_id, completion_date) VALUES (?, ?)`,
        [habit_id, dateString]
      )
    } else {
      response = await DB.execute(
        `DELETE FROM completions WHERE habit_id = ? AND completion_date = ?`,
        [habit_id, dateString]
      )
    }
    if (!response) {
      return new Response(
        JSON.stringify({ error: 'Error updating completion' }),
        {
          status: 500
        }
      )
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200
    })
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: err }), {
      status: 500
    })
  }
}
