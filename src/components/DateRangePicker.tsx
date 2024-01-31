import { DateRangePicker, DateRangePickerItem, DateRangePickerValue } from "@tremor/react"
import {
  getStartOfToday,
  getEndOfToday,
  getStartOfYesterday,
  getEndOfYesterday,
  getStartOfThisWeek,
  getEndOfThisWeek,
  getStartOfThisMonth,
  getEndOfThisMonth
} from '../utils/utils'
import React from "react"

type CustomDatePickerProps = {
  onValueChange: (value: DateRangePickerValue) => void
  value: DateRangePickerValue
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = (props: CustomDatePickerProps) => {
  return (
    <DateRangePicker
      className="h-full"
      enableSelect={true}
      onValueChange={props.onValueChange}
      value={props.value}
    >
      <DateRangePickerItem
        key="Today"
        value="today"
        from={getStartOfToday()}
        to={getEndOfToday()}
      >
        Today
      </DateRangePickerItem>
      <DateRangePickerItem
        key="Yesterday"
        value="yesterday"
        from={getStartOfYesterday()}
        to={getEndOfYesterday()}
      >
        Yesterday
      </DateRangePickerItem>
      <DateRangePickerItem
        key="This Week"
        value="thisWeek"
        from={getStartOfThisWeek()}
        to={getEndOfThisWeek()}
      >
        This Week
      </DateRangePickerItem>
      <DateRangePickerItem
        key="This Month"
        value="thisMonth"
        from={getStartOfThisMonth()}
        to={getEndOfThisMonth()}
      >
        This Month
      </DateRangePickerItem>
    </DateRangePicker>
  )
}

export default CustomDatePicker