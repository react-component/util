/* eslint-disable no-underscore-dangle,react/require-default-props */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ContainerRender from './ContainerRender';
import Portal from './Portal';
import switchScrollingEffect from './switchScrollingEffect';
import setStyle from './setStyle';

let openCount = 0;
const windowIsUndefined = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const IS_REACT_16 = 'createPortal' in ReactDOM;

// https://github.com/ant-design/ant-design/issues/19340
// https://github.com/ant-design/ant-design/issues/19332
let cacheOverflow = {};

const getParent = getContainer => {
  if (windowIsUndefined) {
    return null;
  }
  if (getContainer) {
    if (typeof getContainer === 'string') {
      return document.querySelectorAll(getContainer)[0];
    }
    if (typeof getContainer === 'function') {
      return getContainer();
    }
    if (
      typeof getContainer === 'object' &&
      getContainer instanceof window.HTMLElement
    ) {
      return getContainer;
    }
  }
  return document.body;
};

export type GetContainer = HTMLElement;

export interface PortalWrapperProps {
  visible?: boolean;
  getContainer?: GetContainer;
  wrapperClassName?: string;
  forceRender?: boolean;
  children: (info: {
    getOpenCount: () => number;
    getContainer: () => HTMLElement;
    switchScrollingEffect: () => void;
    ref?: (c: any) => void;
  }) => React.ReactNode;
}

export interface PortalWrapperState {
  _self: PortalWrapper;
}

class PortalWrapper extends React.Component<
  PortalWrapperProps,
  PortalWrapperState
> {
  container?: HTMLElement;

  _component?: any;

  renderComponent?: (info: {
    afterClose: Function;
    onClose: Function;
    visible: boolean;
  }) => void;

  removeContainer?: Function;

  constructor(props: PortalWrapperProps) {
    super(props);
    const { visible, getContainer } = props;
    if (!windowIsUndefined && getParent(getContainer) === document.body) {
      openCount = visible ? openCount + 1 : openCount;
    }
    this.state = {
      _self: this,
    };
  }

  componentDidUpdate() {
    this.setWrapperClassName();
  }

  componentWillUnmount() {
    const { visible, getContainer } = this.props;
    if (!windowIsUndefined && getParent(getContainer) === document.body) {
      // 离开时不会 render， 导到离开时数值不变，改用 func 。。
      openCount = visible && openCount ? openCount - 1 : openCount;
    }
    this.removeCurrentContainer(visible);
  }

  static getDerivedStateFromProps(props, { prevProps, _self }) {
    const { visible, getContainer } = props;
    if (prevProps) {
      const {
        visible: prevVisible,
        getContainer: prevGetContainer,
      } = prevProps;
      if (
        visible !== prevVisible &&
        !windowIsUndefined &&
        getParent(getContainer) === document.body
      ) {
        openCount = visible && !prevVisible ? openCount + 1 : openCount - 1;
      }
      const getContainerIsFunc =
        typeof getContainer === 'function' &&
        typeof prevGetContainer === 'function';
      if (
        getContainerIsFunc
          ? getContainer.toString() !== prevGetContainer.toString()
          : getContainer !== prevGetContainer
      ) {
        _self.removeCurrentContainer(false);
      }
    }
    return {
      prevProps: props,
    };
  }

  getContainer = () => {
    if (windowIsUndefined) {
      return null;
    }
    if (!this.container) {
      this.container = document.createElement('div');
      const parent = getParent(this.props.getContainer);
      if (parent) {
        parent.appendChild(this.container);
      }
    }
    this.setWrapperClassName();
    return this.container;
  };

  setWrapperClassName = () => {
    const { wrapperClassName } = this.props;
    if (
      this.container &&
      wrapperClassName &&
      wrapperClassName !== this.container.className
    ) {
      this.container.className = wrapperClassName;
    }
  };

  savePortal = (c: any) => {
    // Warning: don't rename _component
    // https://github.com/react-component/util/pull/65#discussion_r352407916
    this._component = c;
  };

  removeCurrentContainer = visible => {
    this.container = null;
    this._component = null;
    if (!IS_REACT_16) {
      if (visible) {
        this.renderComponent({
          afterClose: this.removeContainer,
          onClose() {},
          visible: false,
        });
      } else {
        this.removeContainer();
      }
    }
  };

  /**
   * Enhance ./switchScrollingEffect
   * 1. Simulate document body scroll bar with
   * 2. Record body has overflow style and recover when all of PortalWrapper invisible
   * 3. Disable body scroll when PortalWrapper has open
   *
   * @memberof PortalWrapper
   */
  switchScrollingEffect = () => {
    if (openCount === 1 && !Object.keys(cacheOverflow).length) {
      switchScrollingEffect();
      // Must be set after switchScrollingEffect
      cacheOverflow = setStyle({
        overflow: 'hidden',
        overflowX: 'hidden',
        overflowY: 'hidden',
      });
    } else if (!openCount) {
      setStyle(cacheOverflow);
      cacheOverflow = {};
      switchScrollingEffect(true);
    }
  };

  render() {
    const { children, forceRender, visible } = this.props;
    let portal = null;
    const childProps = {
      getOpenCount: () => openCount,
      getContainer: this.getContainer,
      switchScrollingEffect: this.switchScrollingEffect,
    };
    // support react15
    if (!IS_REACT_16) {
      return (
        <ContainerRender
          parent={this}
          visible={visible}
          autoDestroy={false}
          getComponent={(extra = {}) =>
            children({
              ...extra,
              ...childProps,
              ref: this.savePortal,
            })
          }
          getContainer={this.getContainer}
          forceRender={forceRender}
        >
          {({ renderComponent, removeContainer }) => {
            this.renderComponent = renderComponent;
            this.removeContainer = removeContainer;
            return null;
          }}
        </ContainerRender>
      );
    }
    if (forceRender || visible || this._component) {
      portal = (
        <Portal getContainer={this.getContainer} ref={this.savePortal}>
          {children(childProps)}
        </Portal>
      );
    }
    return portal;
  }
}

export default PortalWrapper;
