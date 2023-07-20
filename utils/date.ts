import { format } from 'date-fns'

const getFormattedDate = (
  date: Date,
  options: { format: string }
) => {
  return format(date, options.format, {})
}

export { getFormattedDate }
