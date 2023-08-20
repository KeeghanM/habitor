import { setScreen } from '../_store'
export default function StatsButton() {
  return (
    <button
      onclick={() => setScreen('stats')}
      class="fixed bottom-0 left-0 right-0 mx-auto mb-6 w-fit  rounded-lg bg-gray-800 px-4 py-2 font-bold uppercase text-gray-300 transition-colors duration-300 hover:bg-gray-900 hover:shadow-lg"
    >
      Stats
    </button>
  )
}
