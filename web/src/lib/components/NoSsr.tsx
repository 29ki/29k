import {useEffect, useState} from 'react';

const NoSsr = ({children}: {children: React.ReactNode}) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return children;
};

export default NoSsr;
