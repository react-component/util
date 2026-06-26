import React from 'react';
import { Portal } from '@rc-component/util';

const Demo: React.FC = () => {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [container, setContainer] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    console.log('>>>', divRef.current);
  }, []);

  React.useEffect(() => {
    const element = document.createElement('div');
    element.style.backgroundColor = 'red';
    element.style.height = '20px';
    document.body.appendChild(element);
    setContainer(element);

    return () => {
      element.remove();
    };
  }, []);

  return (
    <>
      {container && (
        <Portal getContainer={() => container}>
          <div ref={divRef}>2333</div>
        </Portal>
      )}
    </>
  );
};

export default Demo;
