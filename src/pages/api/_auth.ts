export default async function GetUserId(
  request: Request
): Promise<string | null> {
  const access_token = request.headers.get('Authorization')?.split(' ')[1]
  if (!access_token) {
    return null
  }

  const headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${access_token}`
  }
  const response = await fetch(
    import.meta.env.PUBLIC_AUTH_DOMAIN + '/oauth2/user_profile',
    {
      method: 'GET',
      headers: headers
    }
  )
  if (response.status === 200) {
    return (await response.json()).id
  } else {
    return null
  }
}
