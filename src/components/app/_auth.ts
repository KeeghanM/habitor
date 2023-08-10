import { createKindeClient } from '@kinde-oss/kinde-auth-pkce-js'
import { createSignal, onMount } from 'solid-js'
export const [kinde, setKinde] = createSignal<any>(null)

onMount(async () => {
  const kinde = await createKindeClient({
    client_id: import.meta.env.PUBLIC_AUTH_CLIENT_ID,
    domain: import.meta.env.PUBLIC_AUTH_DOMAIN,
    redirect_uri: import.meta.env.PUBLIC_AUTH_REDIRECT_URI
  })
  setKinde(kinde)
})
