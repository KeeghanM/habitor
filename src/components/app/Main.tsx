import { Show } from 'solid-js'
import { kinde } from './_auth'
import Habits from './Habits'
import Header from './Header'
import { screen, setScreen } from './_store'
import Stats from './Stats/stats'

export default function MainApp() {
  return (
    <Show when={kinde()?.getUser()} fallback={kinde()?.login()}>
      <div class="min-h-screen w-screen bg-gray-700">
        <Header />
        <Show when={screen() == 'habits'}>
          <Habits />
          <button
            onclick={() => setScreen('stats')}
            class="fixed bottom-0 left-0 right-0 mx-auto mb-6 w-fit  rounded-lg bg-gray-800 px-4 py-2 font-bold uppercase text-gray-300 transition-colors duration-300 hover:bg-gray-900 hover:shadow-lg"
          >
            Stats
          </button>
        </Show>

        <Show when={screen() == 'stats'}>
          <Stats />
          <button
            onclick={() => setScreen('habits')}
            class="fixed bottom-0 left-0 right-0 mx-auto mb-6 w-fit  rounded-lg bg-gray-800 px-4 py-2 font-bold uppercase text-gray-300 transition-colors duration-300 hover:bg-gray-900 hover:shadow-lg"
          >
            Habits
          </button>
        </Show>
      </div>
    </Show>
  )
}
