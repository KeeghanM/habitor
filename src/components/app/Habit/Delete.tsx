import { createSignal } from 'solid-js'
import { kinde } from '../_auth'
import { setHabits, type HabitType } from '../_store'

export default function Delete(props: { habit: HabitType }) {
  const [showModal, setShowModal] = createSignal(false)

  const handleDelete = async () => {
    const token = await kinde().getToken()
    const response = await fetch(`/api/habits/${props.habit.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if (response.status === 200) {
      setHabits((habits) => habits.filter((h) => h.id !== props.habit.id))
    }
    setShowModal(false)
  }

  return (
    <>
      <button
        class="ml-auto h-fit text-red-600 transition-colors duration-300 hover:text-red-700"
        onclick={() => setShowModal(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M16.066 8.995a.75.75 0 1 0-1.06-1.061L12 10.939L8.995 7.934a.75.75 0 1 0-1.06 1.06L10.938 12l-3.005 3.005a.75.75 0 0 0 1.06 1.06L12 13.06l3.005 3.006a.75.75 0 0 0 1.06-1.06L13.062 12l3.005-3.005Z"
          />
        </svg>
      </button>
      <div
        onclick={() => setShowModal(false)}
        class={
          'left-0 top-0 z-40 h-screen w-screen bg-black opacity-50 ' +
          (showModal() ? 'fixed' : 'hidden')
        }
      ></div>
      <div
        class={
          'left-0 right-0 top-64 z-50 mx-auto flex max-w-xl flex-col rounded-lg bg-gray-800 p-6 text-gray-200 ' +
          (showModal() ? 'fixed' : 'hidden')
        }
      >
        <h2 class="text-2xl font-bold">
          Are you sure you want to delete {props.habit.name}
        </h2>
        <div class="mt-6 flex gap-2">
          <button
            class="flex-1 rounded-lg bg-red-600 px-4 py-2 font-bold text-gray-200 hover:bg-red-700"
            onclick={() => handleDelete()}
          >
            Delete
          </button>
          <button
            class="flex-1 rounded-lg bg-gray-600 px-4 py-2 font-bold text-gray-200 hover:bg-gray-700"
            onclick={() => setShowModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  )
}
