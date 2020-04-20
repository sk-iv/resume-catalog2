import React from 'react';
import PropTypes from 'prop-types';
import SelectInput from './SelectInput';
import formControlState from '../Form/formControlState';
import useFormControl from '../Form/useFormControl';
import Input from '../Input';


if (process.env.WEBPACK) {
  require('./select.css');
}

const Select = React.forwardRef((props, ref) => {
  const {
    autoWidth = false,
    children,
    displayEmpty = false,
    IconComponent = 'chevron-down',
    input,
    inputProps,
    MenuProps,
    multiple = false,
    native = false,
    onClose,
    onOpen,
    open,
    renderValue,
    SelectDisplayProps,
    variant: variantProps = 'standard',
    labelWidth = 0,
    ...other
  } = props;

  const inputComponent = SelectInput;

  const muiFormControl = useFormControl();
  const fcs = formControlState({
    props,
    muiFormControl,
    states: ['variant'],
  });

  const variant = fcs.variant || variantProps;

  const InputComponent = input
    || {
      standard: <Input />,
    }[variant];

  return React.cloneElement(InputComponent, {
    // Most of the logic is implemented in `SelectInput`.
    // The `Select` component is a simple API wrapper to expose something better to play with.
    inputComponent,
    select: true,
    inputProps: {
      children,
      IconComponent,
      variant,
      type: undefined, // We render a select. We can ignore the type provided by the `Input`.
      multiple,
      ...(native
        ? {}
        : {
          autoWidth,
          displayEmpty,
          MenuProps,
          onClose,
          onOpen,
          open,
          renderValue,
          SelectDisplayProps,
        }),
      ...inputProps,
      ...(input ? input.props.inputProps : {}),
    },
    ref,
    ...other,
  });
});

Select.propTypes = {
  /**
   * If true, the width of the popover will automatically be set according to the items inside the
   * menu, otherwise it will be at least the width of the select input.
   */
  autoWidth: PropTypes.bool,
  /**
   * The option elements to populate the select with.
   * Can be some `MenuItem` when `native` is false and `option` when `native` is true.
   *
   * ⚠️The `MenuItem` elements **must** be direct descendants when `native` is false.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  // classes: PropTypes.object.isRequired,
  /**
   * If `true`, a value is displayed even if no items are selected.
   *
   * In order to display a meaningful value, a function should be passed to the `renderValue` prop which returns the value to be displayed when no items are selected.
   * You can only use it when the `native` prop is `false` (default).
   */
  displayEmpty: PropTypes.bool,
  /**
   * The icon that displays the arrow.
   */
  IconComponent: PropTypes.elementType,
  /**
   * An `Input` element; does not have to be a material-ui specific `Input`.
   */
  input: PropTypes.element,
  /**
   * [Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) applied to the `input` element.
   * When `native` is `true`, the attributes are applied on the `select` element.
   */
  inputProps: PropTypes.object,
  /**
   * The label width to be used on OutlinedInput.
   * This prop is required when the `variant` prop is `outlined`.
   */
  labelWidth: PropTypes.number,
  /**
   * Props applied to the [`Menu`](/api/menu/) element.
   */
  MenuProps: PropTypes.object,
  /**
   * If true, `value` must be an array and the menu will support multiple selections.
   */
  multiple: PropTypes.bool,
  /**
   * If `true`, the component will be using a native `select` element.
   */
  native: PropTypes.bool,
  /**
   * Callback function fired when a menu item is selected.
   *
   * @param {object} event The event source of the callback.
   * You can pull out the new value by accessing `event.target.value` (any).
   * @param {object} [child] The react element that was selected when `native` is `false` (default).
   */
  onChange: PropTypes.func,
  /**
   * Callback fired when the component requests to be closed.
   * Use in controlled mode (see open).
   *
   * @param {object} event The event source of the callback.
   */
  onClose: PropTypes.func,
  /**
   * Callback fired when the component requests to be opened.
   * Use in controlled mode (see open).
   *
   * @param {object} event The event source of the callback.
   */
  onOpen: PropTypes.func,
  /**
   * Control `select` open state.
   * You can only use it when the `native` prop is `false` (default).
   */
  open: PropTypes.bool,
  /**
   * Render the selected value.
   * You can only use it when the `native` prop is `false` (default).
   *
   * @param {*} value The `value` provided to the component.
   * @returns {ReactElement}
   */
  renderValue: PropTypes.func,
  /**
   * Props applied to the clickable div element.
   */
  SelectDisplayProps: PropTypes.object,
  /**
   * The input value.
   * This prop is required when the `native` prop is `false` (default).
   */
  value: PropTypes.any,
  /**
   * The variant to use.
   */
  variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
};

Select.muiName = 'Select';

export default Select;
