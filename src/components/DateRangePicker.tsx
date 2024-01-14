import { DateRangePicker, DateRangePickerItem, DateRangePickerValue } from "@tremor/react"
import moment from "moment"
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
        from={new Date()}
      >
        Today
      </DateRangePickerItem>
      <DateRangePickerItem
        key="Yesterday"
        value="yesterday"
        from={moment().subtract(1, 'day').toDate()}
        to={moment().subtract(1, 'day').toDate()}
      >
        Yesterday
      </DateRangePickerItem>
      <DateRangePickerItem
        key="This Week"
        value="thisWeek"
        from={moment().startOf('week').toDate()}
      >
        This Week
      </DateRangePickerItem>
      <DateRangePickerItem
        key="This Month"
        value="thisMonth"
        from={moment().startOf('month').toDate()}
      >
        This Month
      </DateRangePickerItem>
    </DateRangePicker>
  )
}

export default CustomDatePicker