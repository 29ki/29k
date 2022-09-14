import React, { PureComponent } from 'react';
import { v4 as uuidv4 } from 'uuid';

class Control extends PureComponent {
  constructor(props) {
    super(props);

    if (!props.value) this.generateId();
  }

  generateId = () => {
    const { onChange } = this.props;
    const id = uuidv4();

    onChange(id);
  };

  componentDidUpdate = () => {
    const { value } = this.props;

    if (!value) this.generateId();
  };

  render() {
    const { forID, classNameWrapper, setActiveStyle, setInactiveStyle, value } =
      this.props;
    return (
      <input
        type="text"
        className={classNameWrapper}
        style={{
          color: '#cdcdcd',
        }}
        value={value || ''}
        id={forID}
        onFocus={setActiveStyle}
        onBlur={setInactiveStyle}
        disabled
      />
    );
  }
}

const Widget = {
  name: 'uniqueId',
  controlComponent: Control,
};

export { Widget, Control };
