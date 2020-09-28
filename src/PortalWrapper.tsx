/* eslint-disable no-underscore-dangle,react/require-default-props */
import * as React from 'react';
import raf from './raf';
import Portal, { PortalRef } from './Portal';
import switchScrollingEffect from './switchScrollingEffect';
import setStyle from './setStyle';
import canUseDom from './Dom/canUseDom';

let openCount = 0;
const supportDom = canUseDom();

/** @private Test usage only */
export function getOpenCount() {
  return process.env.NODE_ENV === 'test' ? openCount : 0;
}

// https://github.com/ant-design/ant-design/issues/19340
// https://github.com/ant-design/ant-design/issues/19332
let cacheOverflow = {};

const getParent = (getContainer: GetContainer) => {
  if (!supportDom) {
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

export type GetContainer = string | HTMLElement | (() => HTMLElement);

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

  componentRef: React.RefObject<PortalRef> = React.createRef();

  rafId?: number;

  renderComponent?: (info: {
    afterClose: Function;
    onClose: Function;
    visible: boolean;
  }) => void;

  constructor(props: PortalWrapperProps) {
    super(props);
    const { visible, getContainer } = props;
    if (supportDom && getParent(getContainer) === document.body) {
      openCount = visible ? openCount + 1 : openCount;
    }
    this.state = {
      _self: this,
    };
  }

  componentDidMount() {
    if (!this.attachToParent()) {
      this.rafId = raf(() => {
        this.forceUpdate();
      });
    }
  }

  componentDidUpdate() {
    this.setWrapperClassName();
    this.attachToParent();
  }

  componentWillUnmount() {
    const { visible, getContainer } = this.props;
    if (supportDom && getParent(getContainer) === document.body) {
      // 离开时不会 render， 导到离开时数值不变，改用 func 。。
      openCount = visible && openCount ? openCount - 1 : openCount;
    }
    this.removeCurrentContainer();
    raf.cancel(this.rafId);
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
        supportDom &&
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
        _self.removeCurrentContainer();
      }
    }
    return {
      prevProps: props,
    };
  }

  attachToParent = (force = false) => {
    if (force || (this.container && !this.container.parentNode)) {
      const parent = getParent(this.props.getContainer);
      if (parent) {
        parent.appendChild(this.container);
        return true;
      }

      return false;
    }

    return true;
  };

  getContainer = () => {
    if (!supportDom) {
      return null;
    }
    if (!this.container) {
      this.container = document.createElement('div');
      this.attachToParent(true);
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

  removeCurrentContainer = () => {
    // Portal will remove from `parentNode`.
    // Let's handle this again to avoid refactor issue.
    this.container?.parentNode?.removeChild(this.container);
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

    if (forceRender || visible || this.componentRef.current) {
      portal = (
        <Portal getContainer={this.getContainer} ref={this.componentRef}>
          {children(childProps)}
        </Portal>
      );
    }
    return portal;
  }
}

export default PortalWrapper;
