import * as React from 'react';

let uuid = 0;

const isTestEnv = process.env.NODE_ENV === 'test';
const supportUseId = !!React.useId;

export default function useId(id?: string) {
  // Inner id for accessibility usage. Only work in client side
  const [innerId, setInnerId] = React.useState<string>('ssr-id');

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const reactNativeId = supportUseId ? React.useId() : undefined;

  React.useEffect(() => {
    if (!supportUseId) {
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
  if (isTestEnv) {
    return 'test-id';
  }

  // Return react native id or inner id
  return reactNativeId || innerId;
}
