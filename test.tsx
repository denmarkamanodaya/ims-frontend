"use client";

import { FC, useMemo, useState, useEffect, SetStateAction, Dispatch, useContext  } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { calendarStates } from "@/store/Calendar";
import { DatePicker } from "@mui/x-date-pickers";
import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { genericGetRequest } from "@/hooks/genericGetRequest";
import { GameType, TotalType } from "@/lib/types";
import axios from "axios";
import { DateTimeFormatOptions, useLocale } from "next-intl";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import { useDateFormatter } from "@/hooks/useDateFormatter";
import { ModalContext } from "@/contexts/ModalContext";
import axiosInstance, { setLocaleHeader } from "@/utils/axios";

interface CommFiltersDesktopProps {
  sessionId: string | null | undefined;
  isSubmitting: boolean;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  setErrorMsg: Dispatch<SetStateAction<string>>;
  setGames: Dispatch<SetStateAction<any[]>>;
  setGamesTotal: Dispatch<SetStateAction<TotalType>>;
  searchKeyword: string;
  setSearchKeyword: Dispatch<SetStateAction<string>>;
  searchGameText: string;
  allGamesText: string;
  applyFilterText: string;
  addClass: string;
}

const CommFiltersDesktop: FC<CommFiltersDesktopProps> = ({
      sessionId,
      isSubmitting,
      setIsSubmitting,
      setErrorMsg,
      setGames,
      setGamesTotal,
      searchKeyword,
      setSearchKeyword,
      searchGameText,
      allGamesText,
      applyFilterText,
      addClass,
 }) => {
  const { fromInitDate, setNewFromDate, toInitDate, setNewToDate } =
    calendarStates();

  const [gameID, setGameID] = useState<string>('')
  const [gameList, setGameList] = useState<GameType[]>([])
  const { isModalOpen, setIsModalOpen } = useContext(ModalContext)

  const maxDate = dayjs(new Date()).add(1, 'month')

  const timezone = "fr-CA"
  const options = {
    timeZone: "UCT",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  } as DateTimeFormatOptions;

  const shortDateFormat = useDateFormatter(timezone, options)

  const handleFilterByGame = (event: SelectChangeEvent) => {
    setGameID(event.target.value as string);
  };

  // set the value of our useState query anytime the user types on our input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()

    setSearchKeyword(e.target.value)
  }

  const handleFilter = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()

    setIsSubmitting(true)

    const start_date = shortDateFormat.format(new Date(fromInitDate.startOf('month').format('YYYY-MM-DD')))
    const end_date = shortDateFormat.format(new Date(toInitDate.endOf('month').format('YYYY-MM-DD')))

    if (sessionId) {
      const cancelToken = axios.CancelToken;
      const source = cancelToken.source();

      const url = `/api/report/gamesTable?user_id=${sessionId}&game_id=${gameID === 'All Games' ? '' : gameID}&start_date=${start_date}&end_date=${end_date}`
      setLocaleHeader(locale)
      axiosInstance
        .get(url,{
          cancelToken: source.token,
        })
        .then(response => {
          if(response.status === 200) {
            console.log(response.data)
            setGames(response.data.games)
            setGamesTotal(response.data.total)
            setIsSubmitting(false)
            setIsModalOpen(false)
          }
        })
        .catch(error => {
          if (axios.isCancel(error)) {
            console.log('Request canceled', error.message);
            setIsSubmitting(false)
          } else {
            setErrorMsg(error.response.data.message)
            setIsSubmitting(false)
          }
        });
    }
  }

  const locale = useLocale()
  const dayjsLocale = locale === 'ja' ? dayjs.locale('ja') : dayjs.locale('en')

  useEffect(() => {
    if (sessionId) genericGetRequest(`/api/report/gamesDropdown?user_id=${sessionId}`, setGameList, locale, setIsSubmitting, setErrorMsg)
  }, [locale, sessionId, setErrorMsg, setIsSubmitting])

  return (
    <div
      className={`sm:flex items-center space-y-3 sm:space-y-0 sm:space-x-0 gap-4 bg-white w-[70vw] sm:w-full rounded-md p-5 sm:p-0 outline-none ${addClass}`}
    >

      <div className="sm:hidden flex justify-between bg-white">
        <div className="font-semibold">Filter</div>
        <div onClick={()=> setIsModalOpen(!isModalOpen)}>
          <Image
            width={24}
            height={24}
            className="relative overflow-hidden shrink-0"
            alt=""
            src="/close-cross.svg"
          />
        </div>
      </div>

        <TextField
          placeholder={searchGameText}
          id="outlined-start-adornment"
          sx={{ 
              m: 1, 
              flex: 1,
              '@media (max-width: 768px)': {
                width: '100%',
                m: 0,
                display: 'none'
              }
          }}
          InputProps={{
            startAdornment: <InputAdornment position="start">
              <Image
                width={16}
                height={16}
                className="relative w-4 h-4 overflow-hidden shrink-0"
                alt=""
                src="/zoomsearch.svg"
              />
            </InputAdornment>,
          }}
          value={searchKeyword}
          onChange={handleChange}
        />

        <FormControl 
          sx={{ 
            // width: '228px'
            flex: 1,
            '@media (max-width: 768px)': {
              width: '100%'
            }
          }}
        >
          <InputLabel id="filterByGame">{allGamesText}</InputLabel>
          <Select
            labelId="filterByGame"
            id="filterByGame"
            value={gameID}
            label="Status"
            onChange={handleFilterByGame}
          >
            <MenuItem value={"All Games"}>{allGamesText}</MenuItem>
            {!isSubmitting && gameList.map((gameData: any) => {
              return <MenuItem key={gameData.id} value={gameData.id}>{ gameData.name }</MenuItem>
            })}
            {/* <MenuItem value='Pending'>Pending</MenuItem>
            <MenuItem value='Paid'>Paid</MenuItem> */}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={dayjsLocale}>
          <DatePicker
            sx={{ 
              // width: '228px',
              flex: 1,
              cursor: "pointer",
              '@media (max-width: 768px)': {
                width: '100%'
              }
            }}
            views={['month', 'year']}
            defaultValue={fromInitDate}
            maxDate={toInitDate}
            onChange={(newValue) => setNewFromDate(newValue)}
          />
        </LocalizationProvider>

        <div className="hidden sm:block">-</div>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={dayjsLocale}>
          <DatePicker
            sx={{ 
              // width: '228px',
              flex: 1,
              '@media (max-width: 768px)': {
                width: '100%'
              }
            }}
            views={['month', 'year']}
            minDate={fromInitDate}
            maxDate={maxDate}
            defaultValue={toInitDate}
            onChange={(newValue) => setNewToDate(newValue)}
          />
        </LocalizationProvider>

        <div
          className="cursor-pointer rounded-21xl bg-accent-blue-primary flex flex-row py-4 px-8 items-center justify-center gap-[12px] text-center text-base text-background-bg-light-01 flex-1"
          onClick={handleFilter}
        >
          <div className="relative tracking-[0.01em] leading-[20px] font-medium">
            {applyFilterText}
          </div>
        </div>
    </div>
  );
};

export default CommFiltersDesktop;

