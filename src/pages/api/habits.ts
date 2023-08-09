import type { APIRoute } from 'astro'
import IsAuthenticated from './_auth'

export const post: APIRoute = async ({ params, request }) => {
  try {
    const isAuthenticated = await IsAuthenticated(request)
    return new Response(JSON.stringify({ isAuthenticated }), {
      status: 200
    })
  } catch (error: any) {
    console.error(error)
    return new Response(JSON.stringify({ error }), {
      status: 500
    })
  }
}
