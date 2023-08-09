import { Show } from 'solid-js'
import CreateHabit from './CreateHabit'
import { kinde } from './_auth'

export default function MainApp() {
  return (
    <div>
      <Show when={kinde()?.getUser()} fallback={kinde()?.login()}>
        <div class="h-screen w-screen">
          <aside class="flex h-screen w-64 flex-col items-center bg-gray-800 py-10 text-gray-200">
            <p class="mb-4 text-xl">
              Welcome back,{' '}
              <span class="italic">{kinde().getUser().given_name}.</span>
            </p>
            <CreateHabit />
          </aside>
        </div>
      </Show>
    </div>
  )
}
