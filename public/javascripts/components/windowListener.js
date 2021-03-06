let React = require('react');

let pull = require('lodash/array/pull');
let debounce = require('lodash/function/debounce');
let camelCase = require('lodash/string/camelCase');
let capitalize = require('lodash/string/capitalize');

const PROP_TYPES = {
  onResize: React.PropTypes.func,
  onScreenChange: React.PropTypes.func,
  onScroll: React.PropTypes.func
};

const SCREEN_NAMES = {
  XS: 0,
  SM: 1,
  MD: 2,
  LG: 3
};

let sharedListener = {
  HANDLE_RESIZE_WAIT: 100,
  LOOP_FALLBACK_TIMEOUT: 1000/60,

  listenTimeouts: [],
  handlers: {},

  handleResize: null,
  triggerScreenChange: null,
  triggerScroll: null,

  isLooping: false,

  pageXOffset: 0,
  pageYOffset: 0,

  screenNames: {
    prev: null,
    cur: null
  },

  getScreenName(windowWidth) {
    const {XS, SM, MD, LG} = SCREEN_NAMES;
    return (windowWidth < 768 ? XS :
      (windowWidth < 992 ? SM :
      (windowWidth < 1200 ? MD : LG)));
  },

  callHandler(type, handler = null) {
    let handlers = handler ? [handler] : this.handlers[type];

    if (handlers && handlers.length > 0) {
      let {
        innerWidth: width, innerHeight: height,
        pageXOffset, pageYOffset
      } = window;
      let {prev: prevScreen, cur: screen} = this.screenNames;
      let args = [];

      switch (type) {
      case 'resize':
        args.push({width, height});
        break;
      case 'screenChange':
        args.push(prevScreen, screen);
        break;
      case 'scroll':
        args.push({pageXOffset, pageYOffset});
        break;
      default:
        break;
      }

      handlers.forEach(handler => {
        handler(...args);
      });
    }
  },

  startLoop() {
    if (!this.isLooping) {
      let {requestAnimationFrame = (callback => {
        setTimeout(callback, this.LOOP_FALLBACK_TIMEOUT);
      })} = window;
      let loop = (() => {
        this.callHandler('loop');
        if (this.isLooping) {
          requestAnimationFrame(loop);
        }
      });
      this.isLooping = true;
      loop();
    }
  },
  stopLoop() {
    this.isLooping = false;
  },

  manageTrigger(action, type) {
    let methodName = `trigger${capitalize(type)}`;
    let func, targetType;

    switch (type) {
    case 'screenChange':
      func = (({width}) => {
        let {cur: name} = this.screenNames;
        let newName = this.getScreenName(width);

        if (name !== newName) {
          this.screenNames.prev = name;
          this.screenNames.cur = newName;

          this.callHandler('screenChange');
        }
      });
      targetType = 'resize';
      break;
    case 'scroll':
      func = (() => {
        let {pageXOffset, pageYOffset} = window;
        if (this.pageXOffset !== pageXOffset ||
          this.pageYOffset !== pageYOffset)
        {
          Object.assign(this, {pageXOffset, pageYOffset});
          this.callHandler('scroll');
        }
      });
      targetType = 'loop';
      break;
    default:
      // TODO: error
      break;
    }

    switch (action) {
    case 'start':
      if (!this[methodName]) {
        this[methodName] = func;
      }
      this.listen(targetType, this[methodName]);
      break;
    case 'stop':
      this.unlisten(targetType, this[methodName]);
      break;
    default:
      // TODO: error
      break;
    }
  },
  startTrigger(type) {
    this.manageTrigger('start', type);
  },
  stopTrigger(type) {
    this.manageTrigger('stop', type);
  },

  listen(type, handler, isOne = false) {
    let handlers = (
      this.handlers[type] = this.handlers[type] || []
    );

    if (handlers.length <= 0) {
      switch (type) {
      case 'loop':
        this.startLoop();
        break;
      case 'resize':
        if (!this.handleResize) {
          this.handleResize = debounce(
            e => {
              this.callHandler('resize');
            }, this.HANDLE_RESIZE_WAIT
          ).bind(this);
        }
        window.addEventListener('resize', this.handleResize);
        break;
      case 'screenChange':
      case 'scroll':
        this.startTrigger(type);
        break;
      default:
        // TODO: error
        break;
      }
    }

    if (isOne) {
      handlers.push(handler);
    } else {
      let id = setTimeout(() => {
        this.callHandler(type, handler);
        handlers.push(handler);
        this.listenTimeouts.splice(
          this.listenTimeouts.findIndex(timeout => (timeout.id === id)), 1
        );
      }, 0);
      this.listenTimeouts.push({id, handler});
    }
  },
  unlisten(type, handler) {
    let handlers = this.handlers[type];

    this.listenTimeouts = this.listenTimeouts.filter(timeout => {
      let isMatch = (timeout.handler === handler);
      if (isMatch) {
        clearTimeout(timeout.id);
      }
      return !isMatch;
    });

    pull(handlers, handler);

    if (handlers.length <= 0) {
      switch (type) {
      case 'loop':
        this.stopLoop();
        break;
      case 'resize':
        window.removeEventListener('resize', this.handleResize);
        break;
      case 'screenChange':
      case 'scroll':
        this.stopTrigger(type);
        break;
      default:
        // TODO: error
        break;
      }
    }
  },
  one(type, handler) {
    let wrapped = ((...args) => {
      handler(...args);
      this.unlisten(type, wrapped);
    });
    this.listen(type, wrapped, true);
  }
};

let WindowListener = React.createClass({
  statics: {
    SCREEN_NAMES
  },

  propTypes: PROP_TYPES,

  forHandlers(callback) {
    Object.keys(PROP_TYPES).forEach(key => {
      const handler = this.props[key];
      let type = camelCase(key.match(/^on(.+)$/)[1]);
      if (handler) {
        callback(handler, type);
      }
    });
  },
  /* public */ one(type, handler) {
    sharedListener.one(...arguments);
  },

  componentDidMount() {
    this.forHandlers((handler, type) => {
      sharedListener.listen(type, handler);
    });
  },
  componentWillUnmount() {
    this.forHandlers((handler, type) => {
      sharedListener.unlisten(type, handler);
    });
  },

  render() {
    return false;
  }
});

module.exports = WindowListener;
