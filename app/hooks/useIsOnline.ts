import dayjs from 'dayjs';
import {ONLINE_TIMING} from './useOnlineDaemon';
import {useEffect, useState} from 'react';

const AWAITING = ONLINE_TIMING * 2;

function getDiff(lastSeen: number) {
  return dayjs().unix() - lastSeen;
}

function getIsOnline(lastSeen: number) {
  return getDiff(lastSeen) <= AWAITING;
}

export default function (lastSeen: number) {
  const [isOnline, setIsOnline] = useState(getIsOnline(lastSeen));
  useEffect(() => {
    const checkOnlineStatus = () => {
      // console.log(`${getDiff(lastSeen)} of ${AWAITING} seconds till offline`);
      if (getIsOnline(lastSeen)) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
        clearInterval(intervalId);
        // console.log('offline');
      }
    };

    checkOnlineStatus();
    const intervalId = setInterval(checkOnlineStatus, 1000);

    return () => clearInterval(intervalId);
  }, [lastSeen]);

  return isOnline;
}
