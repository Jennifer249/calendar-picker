const getYearMonthDay = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()

  return { year, month, day }
}

const getDate = (year, month, day = 1) => {
  return new Date(year, month, day)
}

const getFormatDate = (date) => {
  if (!date) {
    return date
  }
  let { year, month, day } = getYearMonthDay(date)
  month = month + 1 
  return `${year}-${paddingDateZero(month)}-${paddingDateZero(day)}`
}

const paddingDateZero = (num) => {
  return num < 10 ? `0${num}` : num
}

export default {
  getYearMonthDay,
  getDate,
  getFormatDate
}