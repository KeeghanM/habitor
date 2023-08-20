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
        const statFromThisDay = props.stats?.find(
          (stat) => stat.completion_date == date.toISOString().split('T')[0]
        )
        const completed = statFromThisDay != undefined
        const today =
          new Date().toISOString().split('T')[0] ==
          date.toISOString().split('T')[0]

        console.log({
          day,
          date,
          dateString: date.toISOString(),
          statFromThisDay,
          completed
        })

        return (
          <div
            class={
              'h-2 w-2 rounded-full' +
              (completed ? ' bg-lime-600' : ' bg-gray-500') +
              (today ? ' border-2 border-white' : '')
            }
          ></div>
        )
      })}
    </div>
  )
}
