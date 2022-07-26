import * as dayjs from 'dayjs'
import { useEffect, useState } from 'react';

export const useCountdown = (expiryTime) => {

  // let timeText = '';
  const [timeText, setTimeText] = useState('')
  useEffect(() => {
    let timeOut: any = null;
    timeOut = setTimeout(() => {
      let now_time = dayjs().valueOf() // 当前时间戳

      let expiry_time = dayjs(expiryTime).valueOf() // 截止日期时间戳

      let remaining_time = expiry_time - now_time // 剩余时间时间戳

      let timeTexts = dayjs(remaining_time).format('mm:ss') // 时间戳转 mm:ss

      setTimeText(timeTexts)

      return () => clearTimeout(timeOut)
    }, 1000)

  }, [timeText])


  return timeText
}