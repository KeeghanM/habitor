import type { APIRoute } from 'astro'
import { DB } from './_database'

export const get: APIRoute = async ({ params, request }) => {
  try {
    const response = await DB.execute(
      `SELECT id,monday, tuesday, wednesday, thursday, friday, saturday, sunday FROM habits WHERE active = true`
    )
    const habits: any[] = response.rows.map((row: any) => {
      const daysArray: string[] = []
      if (row.monday) daysArray.push('monday')
      if (row.tuesday) daysArray.push('tuesday')
      if (row.wednesday) daysArray.push('wednesday')
      if (row.thursday) daysArray.push('thursday')
      if (row.friday) daysArray.push('friday')
      if (row.saturday) daysArray.push('saturday')
      if (row.sunday) daysArray.push('sunday')

      return {
        id: row.id,
        days: daysArray
      }
    })

    for (const habit of habits) {
      // When we create a habit, we already make 7 days worth of habits in the database
      // So if we check for the next day's date every midnight, we will always have 7 days worth of habits
      const currentDate = new Date()
      currentDate.setDate(currentDate.getDate() + 1)
      const dayName = currentDate
        .toLocaleString('en-GB', { weekday: 'long' })
        .toLowerCase()

      if (habit.days.includes(dayName)) {
        try {
          const checkExisting = await DB.execute(
            `SELECT date FROM habit_dates WHERE habit_id = ? AND date = ?`,
            [habit.id, currentDate.toISOString().split('T')[0]]
          )

          if (checkExisting.rows.length === 0) {
            await DB.execute(
              `INSERT INTO habit_dates (habit_id, date) VALUES (?, ?)`,
              [habit.id, currentDate.toISOString().split('T')[0]]
            )
          }
          console.log(
            'Added habit for',
            currentDate.toISOString().split('T')[0]
          )
        } catch (error) {
          console.error(error)
        }
      }
    }

    return new Response(JSON.stringify({ message: 'success' }), {
      status: 200
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error }), {
      status: 500
    })
  }
}
