import React from 'react';
import toArray, { type Option } from 'rc-util/es/Children/toArray';

const initialState = {
  'no-children': false,
  'a-single': false,
  'multiple-children': false,
  'nested-children': false,
  'array-of-children': false,
  'is-falsy': false,
  'fragment': false,
} as const

type Action = keyof typeof initialState

const Wrapper = ({ children, ...options }: { children?: React.ReactNode } & Option) => {
  window.console.log(toArray(children, options));

  return children as any;
};

const DemoBox = React.memo(({ children, name }: { children?: any, name: Action }) => {
  const [keepEmpty, setkeepEmpty] = React.useState(false);
  const [show, setShow] = React.useState(false)
  return (
    <React.Fragment key={name}>
      <label style={{ display: 'inline-block', width: 180 }}>
        <input type="checkbox" checked={show} onChange={() => setShow(prev => !prev)} />
        {name}
      </label>
      <label>
        <input
          type="checkbox"
          checked={keepEmpty}
          onChange={() => setkeepEmpty(prev => !prev)}
          disabled={!show}
        />
        keepEmpty={keepEmpty ? 'true' : 'false'}
      </label>
      <br />
      {show && React.cloneElement<any>(children, { keepEmpty })}
      <br />
    </React.Fragment>
  )
})

const App = () => (
  <>
    <p onClick={window.console.clear}>Press F12 to open the console (Click Clear Console)</p>

    <DemoBox name="no-children">
      <Wrapper />
    </DemoBox>

    <DemoBox name="a-single">
      <Wrapper>
        <p>1</p>
      </Wrapper>
    </DemoBox>

    <DemoBox name="multiple-children">
      <Wrapper >
        <p>1</p>
        <span>2</span>
      </Wrapper>
    </DemoBox>

    <DemoBox name="nested-children">
      <Wrapper >
        <ul>
          {Array.from({ length: 5 }, (_, i) => <li key={i}>{i}</li>)}
        </ul>
      </Wrapper>
    </DemoBox>

    <DemoBox name="array-of-children">
      <Wrapper >
        {
          [
            [
              [
                <span key="1">111</span>,
                <span key="2">222</span>,
                <span key="3">333</span>
              ],
              <span key="4">444</span>,
              <span key="5">555</span>
            ],
            <span key="6">666</span>,
            <span key="7">777</span>
          ]
        }
      </Wrapper>
    </DemoBox>

    <DemoBox name="is-falsy">
      <Wrapper >
        {null}
        {undefined}
        {false}
        {true}
        {0}
        {''}
        {NaN}
      </Wrapper>
    </DemoBox>

    <DemoBox name="fragment">
      <Wrapper >
        <React.Fragment />
        <React.Fragment >A</React.Fragment>
        <React.Fragment >
          <React.Fragment />
          <React.Fragment >B</React.Fragment>
        </React.Fragment>
      </Wrapper>
    </DemoBox>
  </>
);



export default App;