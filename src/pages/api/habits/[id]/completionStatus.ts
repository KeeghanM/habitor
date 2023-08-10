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
    h.id AS habit_id,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM completions c
            WHERE c.habit_id = h.id AND c.completion_date = CURDATE()
        ) THEN 1 
        ELSE 0 
    END AS is_completed_today,
    COALESCE(
    (
        SELECT value
        FROM completions c
        WHERE c.habit_id = h.id AND c.completion_date = CURDATE()
        LIMIT 1
    ), 
    NULL
) AS todays_value,
    (
        SELECT COUNT(*)
        FROM (
            SELECT hd.date, 
                   CASE WHEN c.completion_date IS NULL THEN 0 ELSE 1 END AS completed
            FROM habit_dates hd
            LEFT JOIN completions c ON hd.habit_id = c.habit_id AND hd.date = c.completion_date
            WHERE hd.habit_id = h.id
            ORDER BY hd.date DESC
        ) AS sub
        WHERE sub.completed = 1 AND sub.date <= CURDATE()
    ) AS current_streak
FROM habits h
WHERE h.id = ?;`,
      [habit_id]
    )

    const { is_completed_today, current_streak, todays_value } = response
      .rows[0] as {
      is_completed_today: string
      current_streak: string
      todays_value: string
    }

    const completed = is_completed_today === '1'
    const streak = parseInt(current_streak)
    const value = todays_value ? todays_value : undefined

    return new Response(JSON.stringify({ completed, streak, value }), {
      status: 200
    })
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ error }), {
      status: 500
    })
  }
}
