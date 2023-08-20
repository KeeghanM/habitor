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
        const formattedDate = date.toLocaleDateString()
        const statFromThisDay = props.stats?.find(
          (stat) => stat.completion_date == date.toISOString().split('T')[0]
        )
        const completed = statFromThisDay != undefined
        const today =
          new Date().toISOString().split('T')[0] ==
          date.toISOString().split('T')[0]

        return (
          <div class="group relative cursor-pointer">
            <div
              class={
                'h-2 w-2 rounded-full' +
                (completed ? ' bg-lime-600' : ' bg-gray-500') +
                (today ? ' border border-white' : '')
              }
            ></div>
            <div class="pointer-events-none absolute z-20 flex flex-col gap-2 rounded bg-white px-2 py-1 text-xs text-black opacity-0 group-hover:opacity-100">
              <p class="whitespace-nowrap">{formattedDate}</p>
              {statFromThisDay?.value && <p>{statFromThisDay?.value}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
