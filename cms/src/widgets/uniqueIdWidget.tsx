import React, {PureComponent} from 'react';
import {v4 as uuidv4} from 'uuid';
import {CmsWidgetControlProps, CmsWidgetParam} from 'decap-cms-core';

type ControlProps = CmsWidgetControlProps & {
  setActiveStyle: React.FocusEventHandler<HTMLInputElement> | undefined;
  setInactiveStyle: React.FocusEventHandler<HTMLInputElement> | undefined;
};

class Control extends PureComponent<ControlProps> {
  constructor(props: ControlProps) {
    super(props);

    if (!props.value) this.generateId();
  }

  generateId = () => {
    const {onChange} = this.props;
    const id = uuidv4();

    onChange(id);
  };

  componentDidUpdate = () => {
    const {value} = this.props;

    if (!value) this.generateId();
  };

  render() {
    const {forID, classNameWrapper, setActiveStyle, setInactiveStyle, value} =
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
} as unknown as CmsWidgetParam;

export {Widget, Control};
