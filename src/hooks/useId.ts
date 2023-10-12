import * as React from 'react';

function getUseId() {
  // We need fully clone React function here to avoid webpack warning React 17 do not export `useId`
  const fullClone = {
    ...React,
  };

  return fullClone.useId;
}

let uuid = 0;

/** @private Note only worked in develop env. Not work in production. */
export function resetUuid() {
  if (process.env.NODE_ENV !== 'production') {
    uuid = 0;
  }
}

const useOriginId = getUseId();

export default useOriginId
  ? // Use React `useId`
    function useId(id?: string) {
      const reactId = useOriginId();

      // Developer passed id is single source of truth
      if (id) {
        return id;
      }

      // Test env always return mock id
      if (process.env.NODE_ENV === 'test') {
        return 'test-id';
      }

      return reactId;
    }
  : // Use compatible of `useId`
    function useCompatId(id?: string) {
      // Inner id for accessibility usage. Only work in client side
      const [innerId, setInnerId] = React.useState<string>('ssr-id');

      React.useEffect(() => {
        const nextId = uuid;
        uuid += 1;

        setInnerId(`rc_unique_${nextId}`);
      }, []);

      // Developer passed id is single source of truth
      if (id) {
        return id;
      }

      // Test env always return mock id
      if (process.env.NODE_ENV === 'test') {
        return 'test-id';
      }

      // Return react native id or inner id
      return innerId;
    };
