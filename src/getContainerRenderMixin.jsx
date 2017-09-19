import ReactDOM from 'react-dom';

function defaultGetContainer() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

export default function getContainerRenderMixin(config) {
  const {
    isVisible,
    getComponent,
    getContainer = defaultGetContainer,
  } = config;

  function renderComponent(instance, componentArg, ready) {
    if (!isVisible || instance._component || isVisible(instance)) {
      if (!instance._container) {
        instance._container = getContainer(instance);
      }
      const component = getComponent(instance, componentArg);
      ReactDOM.unstable_renderSubtreeIntoContainer(instance,
        component, instance._container,
        function callback() {
          instance._component = this;
          if (ready) {
            ready.call(this);
          }
        });
    }
  }

  function removeContainer(instance) {
    if (instance._container) {
      const container = instance._container;
      ReactDOM.unmountComponentAtNode(container);
      container.parentNode.removeChild(container);
      instance._container = null;
    }
  }

  const mixin = {
    renderComponent(componentArg, ready) {
      renderComponent(this, componentArg, ready);
    },
    removeContainer() {
      removeContainer(this);
    },
  };

  return mixin;
}
