import * as dayjs from 'dayjs'
import { useEffect, useState } from 'react';

export const useCountdown = (expiryTime) => {
  const SECONDS = 1000;
  const MINUTE = 60 * SECONDS; // 分
  const HOUR = 60 * MINUTE; // 时
  const DAY = 24 * HOUR; // 天
  const [timeText, setTimeText] = useState('')
  useEffect(() => {
    let timeOut: any = null;
    timeOut = setTimeout(() => {
      // let now_time = dayjs().valueOf() // 当前时间戳

      // let expiry_time = dayjs('2022-07-27 15:00:00').valueOf() // 截止日期时间戳

      // let remaining_time = now_time - expiry_time  // 剩余时间时间戳

      // let timeTexts = dayjs(remaining_time).format('hh:mm:ss') // 时间戳转 mm:ss

      // setTimeText(timeTexts)

      // let nowTime = dayjs().valueOf(); // 当前时间戳(秒)
      // let endTime = dayjs(expiryTime).valueOf(); // 截止时间戳(秒)

      // let diffTime = dayjs('2022-07-27 14:00:06').diff(dayjs(), 'ms')

      let diffTime = dayjs(expiryTime).valueOf() - dayjs().valueOf()

      let timeText = '00:00:00'

      let remain = diffTime;
      const day = parseInt(String(remain / DAY));

      remain %= DAY
      const hour = parseInt(String(remain / HOUR))

      remain %= HOUR
      const minute = parseInt(String(remain / MINUTE));

      remain %= MINUTE
      const second = parseInt(String(remain / SECONDS))
      let timeList: any[] = [];
      if (day > 0) {
        timeList.push(day)
      }
      if (hour > 0) {
        let hours = hour < 10 ? `0${hour}` : day
        timeList.push(hours)
      }
      if (minute > 0) {
        let minutes = minute < 10 ? `0${minute}` : minute;
        timeList.push(minutes)
      }
      if (second > 0) {
        let seconds = second < 10 ? `0${second}` : second;
        timeList.push(seconds)
      }

      if (timeList.length) {
        timeText = timeList.join(':');
      }
      setTimeText(timeText)

      return () => clearTimeout(timeOut)
    }, 1000)

  }, [timeText])


  return timeText
}