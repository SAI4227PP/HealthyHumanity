import { useEffect, useState } from 'react';
import { animate, easeOut } from 'framer-motion';

export const useCountAnimation = (end, duration = 2) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, end, {
      duration,
      ease: easeOut,
      onUpdate(value) {
        setCount(Math.round(value));
      },
    });

    return () => controls.stop();
  }, [end]);

  return count;
};
