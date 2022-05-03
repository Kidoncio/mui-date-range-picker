import { styled } from '@mui/material/styles'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'

type DateRangePickerCustomPickersDayProps = PickersDayProps<Date> & {
  dayIsBetween: boolean
  isFirstDay: boolean
  isLastDay: boolean
}

export const DateRangePickerCustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) =>
    prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})<DateRangePickerCustomPickersDayProps>(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
  ...(dayIsBetween && {
    borderRadius: 0,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(isFirstDay && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...(isLastDay && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
})) as React.ComponentType<DateRangePickerCustomPickersDayProps>
