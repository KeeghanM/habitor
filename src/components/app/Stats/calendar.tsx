type Props = {
  stats: { completion_date: string; value: string }[]
  month: number
  year: number
}
export default function Calendar(props: Props) {
  const daysInMonth = new Date(props.year, props.month, 0).getDate()

  return (
    <div class="grid w-fit grid-cols-7 gap-1">
      {Array.from(Array(daysInMonth).keys()).map((day) => {
        const date = new Date(props.year, props.month - 1, day + 1)
        const formattedDate = date.toISOString().split('T')[0]
        const statFromThisDay = props.stats?.find(
          (stat) => stat.completion_date == formattedDate
        )
        const completed = statFromThisDay != undefined
        const today = new Date().toISOString().split('T')[0] == formattedDate

        return (
          <div class="group relative cursor-pointer">
            <div
              class={
                'h-2 w-2 rounded-full' +
                (completed ? ' bg-lime-600' : ' bg-gray-500') +
                (today ? ' border border-white' : '')
              }
            ></div>
            <div class="pointer-events-none absolute z-20 whitespace-nowrap rounded bg-white px-2 py-1 text-xs text-black opacity-0 group-hover:opacity-100">
              {formattedDate}
            </div>
          </div>
        )
      })}
    </div>
  )
}
