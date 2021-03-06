function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

export default function withPulse(pulse, React, ReactComponent, selectData) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        ...pulse.mapData(
          selectData,
          this,
          {
            waitForMount:
              pulse._private.global.config.waitForMount === false ? false : true
          },
          pulse
        )
      };
    }
    componentDidMount() {
      if (pulse._private.global.config.waitForMount) pulse.mount(this);
    }
    componentWillUnmount() {
      if (pulse._private.global.config.autoUnmount) pulse.unmount(this);
    }
    render() {
      return React.createElement(
        ReactComponent,
        _extends(
          {
            pulse: this.state
          },
          this.props
        )
      );
    }
  };
}
