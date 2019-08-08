import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import ContainerRender from './ContainerRender';
import Portal from './Portal';

let openCount = 0;
const windowIsUndefined = !(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const IS_REACT_16 = 'createPortal' in ReactDOM;

class PortalWrapper extends React.Component {
  static propTypes = {
    wrapperClassName: PropTypes.string,
    forceRender: PropTypes.bool,
    getContainer: PropTypes.any,
    children: PropTypes.func,
    visible: PropTypes.bool,
  }

  constructor(props) {
    super(props);
    const { visible } = props;
    openCount = visible ? openCount + 1 : openCount;
    this.state = {
      _self: this,
    };
  }

  componentDidUpdate() {
    this.setWrapperClassName();
  }
  componentWillUnmount() {
    const { visible } = this.props;
    // 离开时不会 render， 导到离开时数值不变，改用 func 。。
    openCount = visible && openCount ? openCount - 1 : openCount;
    this.removeCurrentContainer(visible);
  }
  static getDerivedStateFromProps(props, { prevProps, _self }) {
    const { visible, getContainer } = props;
    if (prevProps) {
      const { visible: prevVisible, getContainer: prevGetContainer } = prevProps;
      if (visible !== prevVisible) {
        openCount = visible && !prevVisible ? openCount + 1 : openCount - 1;
      }
      if (getContainer !== prevGetContainer) {
        _self.removeCurrentContainer(false);
      }
    }
    return {
      prevProps: props,
    };
  }
  getParent = () => {
    const { getContainer } = this.props;
    if (getContainer) {
      if (typeof getContainer === 'string') {
        return document.querySelectorAll(getContainer)[0];
      }
      if (typeof getContainer === 'function') {
        return getContainer();
      }
      if (typeof getContainer === 'object' && getContainer instanceof window.HTMLElement) {
        return getContainer;
      }
    }
    return document.body;
  }
  getContainer = () => {
    if (windowIsUndefined) {
      return null;
    }
    if (!this.container) {
      this.container = document.createElement('div');
      const parent = this.getParent();
      parent.appendChild(this.container);
    }
    this.setWrapperClassName();
    return this.container;
  }
  setWrapperClassName = () => {
    const { wrapperClassName } = this.props;
    if (this.container && wrapperClassName && wrapperClassName !== this.container.className) {
      this.container.className = wrapperClassName;
    }
  }
  savePortal = (c) => {
    this._component = c;
  }
  removeCurrentContainer = (visible) => {
    this.container = null;
    this._component = null;
    if (!IS_REACT_16) {
      if (visible) {
        this.renderComponent({
          afterClose: this.removeContainer,
          onClose() { },
          visible: false,
        });
      } else {
        this.removeContainer();
      }
    }
  }
  render() {
    const { children, forceRender, visible } = this.props;
    let portal = null;
    const childProps = {
      getOpenCount: () => openCount,
      getContainer: this.getContainer,
    };
    // suppport react15
    if (!IS_REACT_16) {
      return (
        <ContainerRender
          parent={this}
          visible={visible}
          autoDestroy={false}
          getComponent={(extra = {}) => children(
            {
              ...extra,
              ...childProps,
              ref: this.savePortal,
            }
          )}
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
        <Portal getContainer={this.getContainer} ref={this.savePortal} >
          {children(childProps)}
        </Portal>
      );
    }
    return portal;
  }
}
export default polyfill(PortalWrapper);
