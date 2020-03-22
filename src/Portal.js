import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Portal extends React.Component {
  static propTypes = {
    getContainer: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    didUpdate: PropTypes.func,
  };

  static defaultProps = {
    didUpdate: false,
  };

  componentDidMount() {
    this.createContainer();
  }

  componentDidUpdate(prevProps) {
    const { didUpdate } = this.props;
    if (didUpdate) {
      didUpdate(prevProps);
    }
  }

  componentWillUnmount() {
    this.removeContainer();
  }

  createContainer() {
    this.portalContainer = this.props.getContainer();
    this.forceUpdate();
  }

  removeContainer() {
    if (this.portalContainer) {
      this.portalContainer = null;
    }
  }

  render() {
    if (this.portalContainer) {
      const currentContainer = this.props.getContainer();
      if (currentContainer && this.portalContainer !== currentContainer) {
        this.portalContainer = currentContainer;
      }
      return ReactDOM.createPortal(this.props.children, this.portalContainer);
    }
    return null;
  }
}
