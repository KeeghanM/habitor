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
      `SELECT
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM completions c
            JOIN habits h ON c.habit_id = h.id
            WHERE c.habit_id = ? AND c.completion_date = ? AND h.user = ?
        ) THEN 1 
        ELSE 0 
    END AS is_completed_today,
    COALESCE(DATEDIFF(CURDATE(), last_missed_date), 0) AS current_streak
FROM (
    SELECT 
        DATE_ADD(MAX(completion_date), INTERVAL 1 DAY) AS last_missed_date
    FROM completions
    WHERE habit_id = ? AND completion_date NOT IN (
        SELECT DATE_ADD(completion_date, INTERVAL 1 DAY) 
        FROM completions
        WHERE habit_id = ?
    )
) AS sub`,
      [habit_id, dateString, user_id, habit_id, habit_id]
    )

    const { is_completed_today, current_streak } = response.rows[0] as {
      is_completed_today: string
      current_streak: string
    }

    const completed = is_completed_today === '1'
    const streak = parseInt(current_streak) + (completed ? 1 : 0)

    console.log({
      habit_id,
      is_completed_today,
      current_streak,
      completed,
      streak
    })

    return new Response(JSON.stringify({ completed, streak }), {
      status: 200
    })
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ error }), {
      status: 500
    })
  }
}
