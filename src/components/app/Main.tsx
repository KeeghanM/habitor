import { Show } from 'solid-js'
import CreateHabit from './CreateHabit'
import { kinde } from './_auth'
import Habits from './Habits'

export default function MainApp() {
  return (
    <div>
      <Show when={kinde()?.getUser()} fallback={kinde()?.login()}>
        <main class="h-screen w-screen">
          <Habits />
        </main>
        <div class="fixed bottom-0 left-0 right-0 flex h-fit flex-col items-center gap-2 bg-gray-900 px-6 py-6 text-gray-200 shadow-lg ">
          <p class="mb-4 text-xl">
            Welcome back,{' '}
            <span class="italic">{kinde().getUser().given_name}.</span>
          </p>
          <div class="flex gap-4">
            <CreateHabit />
            <button
              onclick={() => kinde().logout()}
              class="w-fit rounded-lg bg-gray-600 px-6 py-2 font-bold uppercase text-red-500 transition-colors duration-300 hover:bg-gray-700 hover:shadow-lg"
            >
              Sign Out
            </button>
          </div>
        </div>
      </Show>
    </div>
  )
}
