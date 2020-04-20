import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import ReactDOM from 'react-dom';
import MenuList from './MenuList';
import Popover from '../Popover';
// import getScrollbarSize from "dom-helpers/util/scrollbarSize";
import setRef from '../utils/setRef';

if (process.env.WEBPACK) {
  require('./menu.css');
}

const RTL_ORIGIN = {
  vertical: 'top',
  horizontal: 'right',
};

const LTR_ORIGIN = {
  vertical: 'top',
  horizontal: 'left',
};

export const styles = {
  paper: {

    /*
         * SpecZ: The maximum height of a simple menu should be one or more rows less than the view
         * height. This ensures a tappable area outside of the simple menu with which to dismiss
         * the menu.
         */
    maxHeight: 'calc(100vh - 96px)',
    // Add iOS momentum scrolling.
    WebkitOverflowScrolling: 'touch',
  },
};

const Menu = React.forwardRef((props, ref) => {
  const {
    autoFocus = true,
    children,
    disableAutoFocusItem = false,
    MenuListProps = {},
    onClose,
    onEntering,
    open,
    PaperProps = {},
    PopoverClasses,
    transitionDuration = 'auto',
    variant = 'selectedMenu',
    ...other
  } = props;

  const autoFocusItem = autoFocus && !disableAutoFocusItem && open;

  const menuListActionsRef = React.useRef(null);
  const contentAnchorRef = React.useRef(null);

  const getContentAnchorEl = () => contentAnchorRef.current;

  const handleEntering = (element, isAppearing) => {
    if (menuListActionsRef.current) {
      menuListActionsRef.current.adjustStyleForScrollbar(element);
    }

    if (onEntering) {
      onEntering(element, isAppearing);
    }
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();

      if (onClose) {
        onClose(event, 'tabKeyDown');
      }
    }
  };

  /**
   * the index of the item should receive focus
   * in a `variant="selectedMenu"` it's the first `selected` item
   * otherwise it's the very first item.
   */
  let activeItemIndex = -1;
  // since we inject focus related props into children we have to do a lookahead
  // to check if there is a `selected` item. We're looking for the last `selected`
  // item and use the first valid item as a fallback
  React.Children.map(children, (child, index) => {
    if (!React.isValidElement(child)) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (child.type === React.Fragment) {
        console.error(
          [
            "Material-UI: the Menu component doesn't accept a Fragment as a child.",
            'Consider providing an array instead.',
          ].join('\n'),
        );
      }
    }

    if (!child.props.disabled) {
      if (variant === 'selectedMenu' && child.props.selected) {
        activeItemIndex = index;
      } else if (activeItemIndex === -1) {
        activeItemIndex = index;
      }
    }
  });

  const items = React.Children.map(children, (child, index) => {
    if (index === activeItemIndex) {
      return React.cloneElement(child, {
        ref: (instance) => {
          // #StrictMode ready
          contentAnchorRef.current = ReactDOM.findDOMNode(instance);
          setRef(child.ref, instance);
        },
      });
    }

    return child;
  });

  return (
    <Popover
      getContentAnchorEl={getContentAnchorEl}
      classes={PopoverClasses}
      onClose={onClose}
      onEntering={handleEntering}
      anchorOrigin={RTL_ORIGIN}
      transformOrigin={RTL_ORIGIN}
      PaperProps={{
        ...PaperProps,
        classes: {
          ...PaperProps.classes,
          root: 'menu-paper',
        },
      }}
      open={open}
      ref={ref}
      transitionDuration={transitionDuration}
      {...other}
    >
      <MenuList
        data-mui-test="Menu"
        onKeyDown={handleListKeyDown}
        actions={menuListActionsRef}
        autoFocus={autoFocus && (activeItemIndex === -1 || disableAutoFocusItem)}
        autoFocusItem={autoFocusItem}
        variant={variant}
        {...MenuListProps}
        className={clsx('menu-list', MenuListProps.className)}
      >
        {items}
      </MenuList>
    </Popover>
  );
});

Menu.propTypes = {
  /**
   * The DOM element used to set the position of the menu.
   */
  anchorEl: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  /**
   * If `true` (Default) will focus the `[role="menu"]` if no focusable child is found. Disabled
   * children are not focusable. If you set this prop to `false` focus will be placed
   * on the parent modal container. This has severe accessibility implications
   * and should only be considered if you manage focus otherwise.
   */
  autoFocus: PropTypes.bool,
  /**
   * Menu contents, normally `MenuItem`s.
   */
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   * See [CSS API](#css) below for more details.
   */
  /**
   * When opening the menu will not focus the active item but the `[role="menu"]`
   * unless `autoFocus` is also set to `false`. Not using the default means not
   * following WAI-ARIA authoring practices. Please be considerate about possible
   * accessibility implications.
   */
  disableAutoFocusItem: PropTypes.bool,
  /**
   * Props applied to the [`MenuList`](/api/menu-list/) element.
   */
  MenuListProps: PropTypes.object,
  /**
   * Callback fired when the component requests to be closed.
   *
   * @param {object} event The event source of the callback.
   * @param {string} reason Can be:`"escapeKeyDown"`, `"backdropClick"`, `"tabKeyDown"`.
   */
  onClose: PropTypes.func,
  /**
   * Callback fired before the Menu enters.
   */
  onEnter: PropTypes.func,
  /**
   * Callback fired when the Menu has entered.
   */
  onEntered: PropTypes.func,
  /**
   * Callback fired when the Menu is entering.
   */
  onEntering: PropTypes.func,
  /**
   * Callback fired before the Menu exits.
   */
  onExit: PropTypes.func,
  /**
   * Callback fired when the Menu has exited.
   */
  onExited: PropTypes.func,
  /**
   * Callback fired when the Menu is exiting.
   */
  onExiting: PropTypes.func,
  /**
   * If `true`, the menu is visible.
   */
  open: PropTypes.bool.isRequired,
  /**
   * @ignore
   */
  PaperProps: PropTypes.object,
  /**
   * `classes` prop applied to the [`Popover`](/api/popover/) element.
   */
  PopoverClasses: PropTypes.object,
  /**
   * The length of the transition in `ms`, or 'auto'
   */
  transitionDuration: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ enter: PropTypes.number, exit: PropTypes.number }),
    PropTypes.oneOf(['auto']),
  ]),
  /**
   * The variant to use. Use `menu` to prevent selected items from impacting the initial focus
   * and the vertical alignment relative to the anchor element.
   */
  variant: PropTypes.oneOf(['menu', 'selectedMenu']),
};

export default Menu;
