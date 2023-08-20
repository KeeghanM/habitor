import { Show } from 'solid-js'
import { kinde } from './_auth'
import Habits from './Habits'
import Header from './Header'
import StatsButton from './Stats/statsButton'
import { screen } from './_store'
import Stats from './Stats/stats'

export default function MainApp() {
  return (
    <Show when={kinde()?.getUser()} fallback={kinde()?.login()}>
      <div class="min-h-screen w-screen bg-gray-700">
        <Header />
        <Show when={screen() == 'habits'}>
          <Habits />
          <StatsButton />
        </Show>

        <Show when={screen() == 'stats'}>
          <Stats />
        </Show>
      </div>
    </Show>
  )
}
