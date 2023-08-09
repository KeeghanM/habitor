import { Show } from 'solid-js'
import CreateHabit from './CreateHabit'
import { kinde } from './_auth'
import Habits from './Habits'

export default function MainApp() {
  return (
    <div>
      <Show when={kinde()?.getUser()} fallback={kinde()?.login()}>
        <div class="grid h-screen w-screen grid-cols-[300px_1fr]">
          <aside class="flex h-screen  w-full flex-col items-center bg-gray-800 px-6 py-10 text-gray-200">
            <p class="mb-4 text-xl">
              Welcome back,{' '}
              <span class="italic">{kinde().getUser().given_name}.</span>
            </p>
            <CreateHabit />
          </aside>
          <main class="w-full">
            <Habits />
          </main>
        </div>
      </Show>
    </div>
  )
}
