import { DateRangePicker, DateRangePickerItem, DateRangePickerValue } from "@tremor/react"
import React from "react"
import moment from "moment"

type CustomDatePickerProps = {
  onValueChange: (value: DateRangePickerValue) => void
  value: DateRangePickerValue,
  placeholder?: string,
  type?: string
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = (props: CustomDatePickerProps) => {
  // time zones
  const est = 'America/Toronto'
  const getStartOfToday = moment.tz(moment(), est).startOf('day').toDate()
  const getEndOfToday = moment.tz(moment(), est).endOf('day').toDate()
  // yesterday
  const getStartOfYesterday = moment.tz(moment(), est).subtract(1, 'day').startOf('day').toDate()
  const getEndOfYesterday = moment.tz(moment(), est).subtract(1, 'day').endOf('day').toDate()
  // this weeek
  const getStartOfThisWeek = moment.tz(moment(), est).startOf('week').toDate()
  const getEndOfThisWeek = moment.tz(moment(), est).endOf('week').toDate()
  // this month
  const getStartOfThisMonth = moment.tz(moment(), est).startOf('month').toDate()
  const getEndOfThisMonth = moment.tz(moment(), est).endOf('month').toDate()

  return (
    <DateRangePicker
      className="max-w-[400px]"
      enableSelect={true}
      onValueChange={props.onValueChange}
      value={props.value}
      // placeholder={props.placeholder ?? "Select Date Range"}
      selectPlaceholder={props.placeholder ?? "Select Range"}
    >
      <DateRangePickerItem
        key="Today"
        value="today"
        from={getStartOfToday}
        to={getEndOfToday}
      >
        Today
      </DateRangePickerItem>
      <DateRangePickerItem
        key="Yesterday"
        value="yesterday"
        from={getStartOfYesterday}
        to={getEndOfYesterday}
      >
        Yesterday
      </DateRangePickerItem>
      <DateRangePickerItem
        key="This Week"
        value="thisWeek"
        from={getStartOfThisWeek}
        to={getEndOfThisWeek}
      >
        This Week
      </DateRangePickerItem>
      <DateRangePickerItem
        key="This Month"
        value="thisMonth"
        from={getStartOfThisMonth}
        to={getEndOfThisMonth}
      >
        This Month
      </DateRangePickerItem>
    </DateRangePicker>
  )
}

export default CustomDatePicker