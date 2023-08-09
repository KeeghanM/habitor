import { Show } from 'solid-js'
import CreateHabit from './CreateHabit'
import { kinde } from './_auth'

export default function MainApp() {
  return (
    <div>
      <Show
        when={kinde()?.getUser()}
        fallback={
          <div class="grid h-screen w-screen place-items-center bg-gray-800 text-white">
            <div class="flex flex-col items-center justify-center gap-4">
              <h1 class="text-4xl font-bold">
                You need to login to use HabitOr
              </h1>
              <button
                onclick={() => kinde().login()}
                class="rounded-lg bg-gray-600 px-6 py-2 font-bold uppercase text-blue-300 transition-colors duration-300 hover:bg-gray-700 hover:shadow-lg sm:col-span-2"
              >
                Login/Register
              </button>
            </div>
          </div>
        }
      >
        <div class="h-screen w-screen">
          <aside class="flex h-screen w-64 flex-col items-center bg-gray-800 py-10 text-gray-200">
            <CreateHabit />
          </aside>
        </div>
      </Show>
    </div>
  )
}
