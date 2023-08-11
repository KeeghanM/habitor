import CreateHabit from './CreateHabit'
import { kinde } from './_auth'

export default function Header() {
  return (
    <div class="sticky top-0 z-20 flex h-fit flex-col items-center gap-2 bg-gray-900 px-6 py-6 text-gray-200 shadow-lg ">
      <p class="mb-4 text-xl">Welcome back, {kinde().getUser().given_name}.</p>
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
  )
}
