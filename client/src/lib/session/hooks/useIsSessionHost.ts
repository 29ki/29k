import useSessionHost from './useSessionHost';

const useIsSessionHost = () => {
  const host = useSessionHost();
  return Boolean(host?.local);
};

export default useIsSessionHost;
