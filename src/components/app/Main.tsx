import { Show } from 'solid-js'
import { kinde } from './_auth'
import Habits from './Habits'
import Header from './Header'

export default function MainApp() {
  return (
    <Show when={kinde()?.getUser()} fallback={kinde()?.login()}>
      <div class="min-h-screen w-screen bg-gray-700">
        <Header />
        <Habits />
      </div>
    </Show>
  )
}
