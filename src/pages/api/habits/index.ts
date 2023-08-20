import type { APIRoute } from 'astro'
import GetUserId from '../_auth'
import { DB } from '../_database'
import type { HabitType } from '../../../components/app/_store'

export const post: APIRoute = async ({ params, request }) => {
  try {
    const user_id = await GetUserId(request)
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401
      })
    }

    const { habit }: { habit: Omit<HabitType, 'id'> } = await request.json()

    // Convert days array to individual boolean columns
    const daysColumns = {
      monday: habit.days.includes('monday'),
      tuesday: habit.days.includes('tuesday'),
      wednesday: habit.days.includes('wednesday'),
      thursday: habit.days.includes('thursday'),
      friday: habit.days.includes('friday'),
      saturday: habit.days.includes('saturday'),
      sunday: habit.days.includes('sunday')
    }

    const response = await DB.execute(
      `INSERT INTO habits (user, name, type, time, monday, tuesday, wednesday, thursday, friday, saturday, sunday, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, true)`,
      [
        user_id,
        habit.name,
        habit.type,
        habit.time,
        ...Object.values(daysColumns)
      ]
    )
    const habitId = response.insertId

    // Generate the next week's dates based on the specified days
    const currentDate = new Date()
    for (let i = 0; i < 7; i++) {
      const dayName = currentDate
        .toLocaleString('en-US', { weekday: 'long' })
        .toLowerCase() as keyof typeof daysColumns
      if (daysColumns[dayName]) {
        await DB.execute(
          `INSERT INTO habit_dates (habit_id, date) VALUES (?, ?)`,
          [habitId, currentDate.toISOString().split('T')[0]]
        )
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }

    const newHabit = { id: habitId, ...habit, streak: 0 }

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

export const get: APIRoute = async ({ params, request }) => {
  try {
    const user_id = await GetUserId(request)
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401
      })
    }

    const response = await DB.execute(
      `SELECT 
    h.id, h.name, h.type, h.time, h.monday, h.tuesday, h.wednesday, h.thursday, h.friday, h.saturday, h.sunday,
    CASE 
        WHEN c.completion_date IS NOT NULL THEN 1 
        ELSE 0 
    END AS is_completed_today,
    c.value,
    CASE 
        WHEN (SELECT MAX(completion_date) FROM completions WHERE habit_id = h.id) IN (CURDATE(), (SELECT MAX(date) FROM habit_dates hd WHERE hd.habit_id = h.id AND hd.date < CURDATE())) THEN
            COALESCE(
                (
                    SELECT 
                        COUNT(*)
                    FROM (
                        SELECT 
                            date,
                            habit_id,
                            completion,
                            date - ROW_NUMBER() OVER (ORDER BY date) AS group_num
                        FROM (
                            SELECT 
                                hd.date,
                                hd.habit_id,
                                CASE WHEN c.id IS NOT NULL THEN 1 ELSE 0 END AS completion
                            FROM habit_dates hd
                            LEFT JOIN completions c ON c.habit_id = hd.habit_id AND c.completion_date = hd.date
                            WHERE hd.habit_id = h.id AND hd.date <= NOW()
                        ) AS ExpectedAndCompleted
                        WHERE completion = 1
                    ) AS GroupedSequences
                    GROUP BY habit_id, group_num
                    HAVING DATEDIFF((SELECT MAX(completion_date) FROM completions WHERE habit_id = h.id), MAX(date)) = 0 -- Ensure the streak is up to the most recent completion date
                    ORDER BY MAX(date) DESC
                    LIMIT 1
                ), 0
            )
        ELSE 0
    END AS current_streak
FROM habits h
LEFT JOIN completions c ON h.id = c.habit_id AND c.completion_date = CURDATE()
WHERE h.user = ? AND h.active = 1;
`,
      [user_id]
    )
    const habits: HabitType[] = response.rows.map((row: any) => {
      const daysArray: string[] = []
      if (row.monday) daysArray.push('monday')
      if (row.tuesday) daysArray.push('tuesday')
      if (row.wednesday) daysArray.push('wednesday')
      if (row.thursday) daysArray.push('thursday')
      if (row.friday) daysArray.push('friday')
      if (row.saturday) daysArray.push('saturday')
      if (row.sunday) daysArray.push('sunday')

      const habit = {
        id: row.id,
        name: row.name,
        type: row.type,
        time: row.time,
        days: daysArray,
        completed: row.is_completed_today === '1',
        streak: parseInt(row.current_streak),
        value: row.value
      }

      return habit
    })

    return new Response(JSON.stringify({ habits }), {
      status: 200
    })
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ error }), {
      status: 500
    })
  }
}
