import CreateHabit from './CreateHabit'

export default function MainApp() {
  return (
    <div class="h-screen w-screen">
      <aside class="flex h-screen w-64 flex-col items-center bg-gray-800 py-10 text-gray-200">
        <CreateHabit />
      </aside>
    </div>
  )
}
