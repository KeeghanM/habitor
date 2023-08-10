import type { APIRoute } from 'astro'
import GetUserId from '../../_auth'
import { DB } from '../../_database'

export const del: APIRoute = async ({ params, request }) => {
  try {
    const user_id = await GetUserId(request)
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401
      })
    }

    const habitId = params.id
    if (!habitId) {
      return new Response(JSON.stringify({ error: 'No habit id provided' }), {
        status: 400
      })
    }

    await DB.execute(`UPDATE habits SET active = 0 WHERE id = ? AND user = ?`, [
      habitId,
      user_id
    ])

    return new Response(JSON.stringify({ success: true }), {
      status: 200
    })
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ error }), {
      status: 500
    })
  }
}
