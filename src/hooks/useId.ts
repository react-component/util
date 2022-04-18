import * as React from 'react';

let uuid = 0;

/** @private Note only worked in develop env. Not work in production. */
export function resetUuid() {
  if (process.env.NODE_ENV !== 'production') {
    uuid = 0;
  }
}

export default function useId(id?: string) {
  // Inner id for accessibility usage. Only work in client side
  const [innerId, setInnerId] = React.useState<string>('ssr-id');

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const reactNativeId = React.useId?.();

  React.useEffect(() => {
    if (!React.useId) {
      const nextId = uuid;
      uuid += 1;

      setInnerId(`rc_unique_${nextId}`);
    }
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
  return reactNativeId || innerId;
}
