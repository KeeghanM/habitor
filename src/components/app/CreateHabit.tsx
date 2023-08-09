import { createEffect, createSignal } from 'solid-js'
import { Habit, setHabits } from './_store'
import { kinde } from './_auth'

export default function CreateHabit() {
  const [showModal, setShowModal] = createSignal(false)
  const [habitName, setHabitName] = createSignal('')
  const [habitType, setHabitType] = createSignal('')
  const [habitTime, setHabitTime] = createSignal('')
  const [habitDays, setHabitDays] = createSignal([] as string[])
  const [isValid, setIsValid] = createSignal(false)

  createEffect(() => {
    setIsValid(
      habitName() !== '' &&
        habitType() !== '' &&
        habitTime() !== '' &&
        habitDays().length > 0
    )
  })

  const createHabit = () => {
    setShowModal(true)
  }

  const handleDay = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.checked) {
      setHabitDays([...habitDays(), target.value])
    } else {
      setHabitDays(habitDays().filter((day) => day !== target.value))
    }
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    if (!isValid()) return

    const habit: Omit<Habit, 'id'> = {
      name: habitName(),
      type: habitType(),
      time: habitTime(),
      days: habitDays()
    }

    const response = await fetch('/api/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${kinde()?.getToken()}`
      },
      body: JSON.stringify(habit)
    })

    if (response.ok) {
      const newHabit = (await response.json()) as Habit
      setHabits((prev) => [...prev, newHabit])
      setHabitName('')
      setHabitType('')
      setHabitTime('')
      setHabitDays([])
      setShowModal(false)
    } else {
      console.error('Error creating habit')
    }
  }

  return (
    <>
      <button
        onclick={createHabit}
        class="rounded-lg bg-gray-600 px-6 py-2 font-bold uppercase text-blue-300 transition-colors duration-300 hover:bg-gray-700 hover:shadow-lg"
      >
        Create Habit
      </button>

      <div
        onclick={() => setShowModal(false)}
        class={
          'left-0 top-0 z-10 h-screen w-screen bg-black opacity-50 ' +
          (showModal() ? 'fixed' : 'hidden')
        }
      ></div>
      <div
        class={
          'left-0 right-0 z-20 mx-auto flex max-w-xl flex-col rounded-lg bg-gray-800 p-6 text-gray-200 ' +
          (showModal() ? 'fixed' : 'hidden')
        }
      >
        <h2 class="text-2xl font-bold text-gray-200">Create a new Habit</h2>
        <form onsubmit={handleSubmit}>
          <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div class="sm:col-span-2">
              <label
                for="name"
                class="mb-2 block text-sm font-medium text-white"
              >
                Habit Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                class="focus:ring-primary-600 focus:border-primary-600 focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-600 bg-gray-700  p-2.5 text-sm text-white placeholder-gray-400"
                placeholder="Type habit name"
                required
                value={habitName()}
                oninput={(e) => {
                  setHabitName(e.target.value)
                }}
              />
            </div>
            <div>
              <label
                for="time"
                class="mb-2 block text-sm font-medium  text-white"
              >
                Time of day
              </label>
              <select
                id="time"
                name="time"
                class="focus:ring-primary-500 focus:border-primary-500 focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-600 bg-gray-700  p-2.5 text-sm text-white placeholder-gray-400"
                required
                value={habitTime()}
                onchange={(e) => {
                  setHabitTime(e.target.value)
                }}
              >
                <option value="">Select time</option>
                <option value="morning">Morning (pre 12pm)</option>
                <option value="daily">Mid-Day (12-5pm)</option>
                <option value="weekly">Evening (after 5pm)</option>
              </select>
            </div>
            <div>
              <label
                for="type"
                class="mb-2 block text-sm font-medium  text-white"
              >
                Type
              </label>
              <select
                id="type"
                name="type"
                class="focus:ring-primary-500 focus:border-primary-500 focus:ring-primary-500 focus:border-primary-500 block w-full rounded-lg border border-gray-600 bg-gray-700  p-2.5 text-sm text-white placeholder-gray-400"
                required
                value={habitType()}
                onchange={(e) => {
                  setHabitType(e.target.value)
                }}
              >
                <option value="">Select type</option>
                <option value="check">Checkbox (yes/no)</option>
                <option value="text">Text input</option>
                <option value="count">Quantity/Counter</option>
                <option value="time">Time</option>
              </select>
            </div>
            <ul class="col-span-2 grid grid-cols-7 gap-2">
              <li>
                <input
                  type="checkbox"
                  onchange={(e) => handleDay(e)}
                  id="monday"
                  name="monday"
                  value="monday"
                  class="peer hidden"
                />
                <label
                  for="monday"
                  class="flex w-full cursor-pointer items-center justify-center rounded-lg border-2  border-gray-700 bg-gray-800 p-5 text-gray-400 hover:bg-gray-700 hover:text-gray-300 peer-checked:border-blue-600 peer-checked:text-gray-300"
                >
                  Mon
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  onchange={(e) => handleDay(e)}
                  id="tuesday"
                  name="tuesday"
                  value="tuesday"
                  class="peer hidden"
                />
                <label
                  for="tuesday"
                  class="flex w-full cursor-pointer items-center justify-center rounded-lg border-2  border-gray-700 bg-gray-800 p-5 text-gray-400 hover:bg-gray-700 hover:text-gray-300 peer-checked:border-blue-600 peer-checked:text-gray-300"
                >
                  Tue
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  onchange={(e) => handleDay(e)}
                  id="wednesday"
                  name="wednesday"
                  value="wednesday"
                  class="peer hidden"
                />
                <label
                  for="wednesday"
                  class="flex w-full cursor-pointer items-center justify-center rounded-lg border-2  border-gray-700 bg-gray-800 p-5 text-gray-400 hover:bg-gray-700 hover:text-gray-300 peer-checked:border-blue-600 peer-checked:text-gray-300"
                >
                  Wed
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  onchange={(e) => handleDay(e)}
                  id="thursday"
                  name="thursday"
                  value="thursday"
                  class="peer hidden"
                />
                <label
                  for="thursday"
                  class="flex w-full cursor-pointer items-center justify-center rounded-lg border-2  border-gray-700 bg-gray-800 p-5 text-gray-400 hover:bg-gray-700 hover:text-gray-300 peer-checked:border-blue-600 peer-checked:text-gray-300"
                >
                  Thurs
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  onchange={(e) => handleDay(e)}
                  id="friday"
                  name="friday"
                  value="friday"
                  class="peer hidden"
                />
                <label
                  for="friday"
                  class="flex w-full cursor-pointer items-center justify-center rounded-lg border-2  border-gray-700 bg-gray-800 p-5 text-gray-400 hover:bg-gray-700 hover:text-gray-300 peer-checked:border-blue-600 peer-checked:text-gray-300"
                >
                  Fri
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  onchange={(e) => handleDay(e)}
                  id="saturday"
                  name="saturday"
                  value="saturday"
                  class="peer hidden"
                />
                <label
                  for="saturday"
                  class="flex w-full cursor-pointer items-center justify-center rounded-lg border-2  border-gray-700 bg-gray-800 p-5 text-gray-400 hover:bg-gray-700 hover:text-gray-300 peer-checked:border-blue-600 peer-checked:text-gray-300"
                >
                  Sat
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  onchange={(e) => handleDay(e)}
                  id="sunday"
                  name="sunday"
                  value="sunday"
                  class="peer hidden"
                />
                <label
                  for="sunday"
                  class="flex w-full cursor-pointer items-center justify-center rounded-lg border-2  border-gray-700 bg-gray-800 p-5 text-gray-400 hover:bg-gray-700 hover:text-gray-300 peer-checked:border-blue-600 peer-checked:text-gray-300"
                >
                  Sun
                </label>
              </li>
            </ul>
            <button class="rounded-lg bg-gray-600 px-6 py-2 font-bold uppercase text-blue-300 transition-colors duration-300 hover:bg-gray-700 hover:shadow-lg sm:col-span-2">
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
