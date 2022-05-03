import React, { useMemo, useState } from 'react'

import { Button, Dialog, DialogActions } from '@mui/material'
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import {
  isBefore,
  isSameDay,
  startOfDay,
  startOfWeek,
  endOfWeek,
  startOfYesterday,
  startOfMonth,
  endOfMonth,
  isAfter,
} from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { DateRangePickerCustomPickersDay } from './DateRangePickerCustomPickersDay'

type DateRangePickerProps = {
  startDate?: Date
  endDate?: Date
  onChange?: (startDate: Date | null, endDate: Date | null) => void
  /**
   * The size of the component.
   * @default 'medium'
   */
  size?: 'small' | 'medium'
  /**
   * @default "Selecione um período"
   */
  placeholder?: string
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onChange,
  startDate,
  endDate,
  size = 'medium',
  placeholder = 'Selecione um período',
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [lastSelectedDate, setLastSelectedDate] = useState<'start' | 'end' | null>(null)
  const [startDateState, setStartDateState] = useState<Date | null>(startDate || null)
  const [endDateState, setEndDateState] = useState<Date | null>(endDate || null)

  const textFieldValue = useMemo(() => {
    if (!startDateState && !endDateState) return placeholder

    if (startDateState && !endDateState)
      return `${startDateState.toLocaleDateString('pt-BR')} - Selecione a data final`

    if (!startDateState && endDateState)
      return `Selecione a data inicial - ${endDateState.toLocaleDateString('pt-BR')}`

    return `${startDateState?.toLocaleDateString('pt-BR')} - ${endDateState?.toLocaleDateString(
      'pt-BR'
    )}`
  }, [endDateState, placeholder, startDateState])

  const renderSelectedDays = (
    date: Date,
    _selectedDates: Array<Date | null>,
    pickersDayProps: PickersDayProps<Date>
  ) => {
    if (!startDateState) {
      return <PickersDay {...pickersDayProps} />
    }

    const currentStart = startDateState || new Date()
    const currentEnd = endDateState || new Date()

    const startIsBeforeEnd = isBefore(currentStart, currentEnd)

    const dayIsBetween = startIsBeforeEnd
      ? (isAfter(date, currentStart) || isSameDay(date, currentStart)) &&
        (isBefore(date, currentEnd) || isSameDay(date, currentEnd))
      : (isBefore(date, currentStart) || isSameDay(date, currentStart)) &&
        (isAfter(date, currentEnd) || isSameDay(date, currentEnd))
    const isFirstDay = isSameDay(date, currentStart)
    const isLastDay = isSameDay(date, currentEnd)

    return (
      <DateRangePickerCustomPickersDay
        {...pickersDayProps}
        disableMargin
        dayIsBetween={dayIsBetween}
        isFirstDay={startIsBeforeEnd ? isFirstDay : isLastDay}
        isLastDay={startIsBeforeEnd ? isLastDay : isFirstDay}
      />
    )
  }

  const clearSelection = () => {
    setStartDateState(null)
    setEndDateState(null)
    setLastSelectedDate(null)
  }

  const onClickToday = () => {
    setStartDateState(new Date())
    setEndDateState(new Date())
  }

  const onClickYesterday = () => {
    setStartDateState(startOfYesterday())
    setEndDateState(startOfYesterday())
  }

  const onClickThisWeek = () => {
    setStartDateState(startOfWeek(new Date()))
    setEndDateState(endOfWeek(new Date()))
  }

  const onClickThisMonth = () => {
    setStartDateState(startOfMonth(new Date()))
    setEndDateState(endOfMonth(new Date()))
  }

  const onClose = () => {
    if (!endDateState) setEndDateState(startDateState)

    if (onChange) onChange(startDateState, endDateState)

    setOpen(false)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ptBR}>
      <TextField size={size} value={textFieldValue} onClick={() => setOpen(true)} />

      <Dialog disableEscapeKeyDown open={open}>
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          value={startDateState}
          onChange={(newDate) => {
            const newDateValue = newDate ? startOfDay(newDate) : null

            if (!lastSelectedDate || lastSelectedDate === 'end') {
              setStartDateState(newDateValue)
              setLastSelectedDate('start')
            } else {
              setEndDateState(newDateValue)
              setLastSelectedDate('end')
            }
          }}
          renderDay={renderSelectedDays}
          renderInput={(params) => <TextField {...params} />}
        />

        <div className="mb-8 flex flex-row">
          <Button onClick={onClickToday}>Hoje</Button>
          <Button onClick={onClickYesterday}>Ontem</Button>
          <Button onClick={onClickThisWeek}>Essa semana</Button>
          <Button onClick={onClickThisMonth}>Esse mês</Button>
        </div>

        <DialogActions>
          <div className="flex w-full flex-row justify-between">
            <Button variant="text" color="secondary" onClick={clearSelection}>
              Limpar
            </Button>

            <Button variant="contained" onClick={onClose}>
              Confirmar
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  )
}
