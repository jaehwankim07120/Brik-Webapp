let React = require('react');
let classNames = require('classnames');
let Helmet = require('react-helmet');
let {intlShape} = require('react-intl');

let size = require('lodash/collection/size');
let some = require('lodash/collection/some');

let {Button, PseudoButton} = require('../buttons');
let {Input, Form} = require('../forms');
let {Image, RImage, ImageBlock} = require('../images');
let {FormattedHTMLMessage} = require('../intl');
let {LinkBlock} = require('../links');
let {Link} = require('../router');
let {ScrollLink} = require('../links');
let Markdown = require('../markdown');
let MessageBoard = require('../messageBoard');
let WindowListener = require('../windowListener');

let IndiegogoLink = require('./indiegogoLink');
let Logo = require('./logo');
let Consolidation = require('./consolidation');

let Immutable = require('seamless-immutable');

let SpendIndex = React.createClass({
    statics: {
      BG_OFFSET_Y_MAX: 25,
      DEFAULT_BG_Y_OFFSETS: Immutable({
        contactless: 0,
        physicalCards: 0,
        design: 0,
        charge: 0,
        app: 0,
        preOrder: 0
      }),
      SECURITY_FEATURES: [{
        key: 'alert',
        name: 'Proximity Alert',
        description: 'Automatic lock &\nself-destruction when lost'
      }, {
        key: 'passcode',
        name: 'Security Passcode',
        description: 'Protect your card data\nwith passcode or fingerprint'
      }, {
        key: 'encrypt',
        name: 'Bank Level Encryption',
        description: '256 bit encryption\nfor all your personal data'
      }]
    },

    propTypes: {
      onNewSubscription: React.PropTypes.func.isRequired
    },

    contextTypes: {
      intl: intlShape.isRequired
    },

    // Instance variables
    // - _sectionRefs
    // - _formRef
    // - _indexVideoRef
    // - _sideViewVideoRef
    // - _securitySliderRef
    // - _isScreenMd
    // - _pageYOffset
    // - _pageYOffsets
    // - _securitySwipe
    // - _windowHeight

    getInitialState() {
      return {
        bgYOffsets: SpendIndex.DEFAULT_BG_Y_OFFSETS,
        enteredClasses: Immutable({
          index: '',
          contactless: '',
          physicalCards: '',
          design: '',
          charge: '',
          tech: '',
          app: '',
          preOrder: ''
        }),
        securitySwipePos: 0,
        subscriptionMsg: null
      };
    },

    setSmallScreenState() {
      let state = {
        enteredClasses: Immutable({
          index: 'is-SpendIndex-index-entered-done',
          contactless: 'is-SpendIndex-contactless-entered-done',
          physicalCards: 'is-SpendIndex-physicalCards-entered-done',
          design: 'is-SpendIndex-design-entered-done',
          charge: 'is-SpendIndex-charge-entered-done',
          tech: 'is-SpendIndex-tech-entered-done',
          app: 'is-SpendIndex-app-entered-done',
          preOrder: 'is-SpendIndex-preOrder-entered-done'
        })
      };
      if (some(this.state.bgYOffsets)) {
        state.bgYOffsets = SpendIndex.DEFAULT_BG_Y_OFFSETS;
      }
      this.setState(state);
    },

    updateAnimated(isEnteredReset = false) {
      if (this._isScreenMd &&
        this._pageYOffsets &&
        typeof this._pageYOffset === 'number' &&
        typeof this._windowHeight === 'number')
      {
        this.updateBgYOffsets();
        this.updateEntered(isEnteredReset);
        this.updateSideViewVideo();
      }
    },
    updateBgYOffsets() {
      const {bgYOffsets} = this.state;
      let newBgYOffsets = {};
      const {BG_OFFSET_Y_MAX} = SpendIndex;
      let halfHeight = this._windowHeight/2;

      let {
        half: contactlessHalf, oneThird: contactlessAThird
      } = this._pageYOffsets.contactless;
      let {
        half: physicalCardsHalf, oneThird: physicalCardsAThird
      } = this._pageYOffsets.physicalCards;
      let {
        half: designHalf, oneThird: designAThird
      } = this._pageYOffsets.design;
      let {
        half: chargeHalf, oneThird: chargeAThird
      } = this._pageYOffsets.charge;
      let {
        half: appHalf, oneThird: appAThird
      } = this._pageYOffsets.app;
      let {
        oneThird: preOrderAThird, twoThirds: preOrderTwoThirds
      } = this._pageYOffsets.preOrder;

      let ranges = {
        contactless: [
          contactlessAThird - this._windowHeight,
          contactlessHalf - halfHeight
        ],
        physicalCards: [
          physicalCardsAThird - this._windowHeight,
          physicalCardsHalf - halfHeight
        ],
        design: [
          designAThird - this._windowHeight, designHalf - halfHeight
        ],
        charge: [
          chargeAThird - this._windowHeight, chargeHalf - halfHeight
        ],
        app: [appAThird - this._windowHeight, appHalf - halfHeight],
        preOrder: [
          preOrderAThird - this._windowHeight, preOrderTwoThirds
        ]
      };

      for (let key in ranges) {
        let bgOffsetY;
        let [min, max] = ranges[key];

        if (this._pageYOffset <= min) {
          bgOffsetY = BG_OFFSET_Y_MAX;
        } else if (this._pageYOffset < max) {
          bgOffsetY = (
            (max - this._pageYOffset)/(max - min)
          )*BG_OFFSET_Y_MAX;
        } else {
          bgOffsetY = 0;
        }

        switch (key) {
        case 'design':
        case 'charge':
          bgOffsetY = -bgOffsetY;
          break;
        default:
          break;
        }

        if (bgYOffsets[key] !== bgOffsetY) {
          newBgYOffsets[key] = bgOffsetY;
        }
      }

      if (size(newBgYOffsets) > 0) {
        this.setState({bgYOffsets: bgYOffsets.merge(newBgYOffsets)});
      }
    },
    updateEntered(isReset) {
      const {enteredClasses} = this.state;
      let newEnteredClasses = {};

      let {
        oneThird: contactlessAThird, twoThirds: contactlessTwoThirds
      } = this._pageYOffsets.contactless;
      let {
        oneThird: physicalCardsAThird, twoThirds: physicalCardsTwoThirds
      } = this._pageYOffsets.physicalCards;
      let {
        oneThird: designAThird, twoThirds: designTwoThirds
      } = this._pageYOffsets.design;
      let {
        oneThird: chargeAThird, twoThirds: chargeTwoThirds
      } = this._pageYOffsets.charge;
      let {
        oneThird: techAThird, twoThirds: techTwoThirds
      } = this._pageYOffsets.tech;
      let {
        oneThird: appAThird, twoThirds: appTwoThirds
      } = this._pageYOffsets.app;
      let {
        oneThird: preOrderAThird, twoThirds: preOrderTwoThirds
      } = this._pageYOffsets.preOrder;

      let ranges = {
        index: [0, this._pageYOffsets.index.twoThirds],
        contactless: [
          contactlessAThird - this._windowHeight, contactlessTwoThirds
        ],
        physicalCards: [
          physicalCardsAThird - this._windowHeight,
          physicalCardsTwoThirds
        ],
        design: [designAThird - this._windowHeight, designTwoThirds],
        charge: [chargeAThird - this._windowHeight, chargeTwoThirds],
        tech: [techAThird - this._windowHeight, techTwoThirds],
        app: [appAThird - this._windowHeight, appTwoThirds],
        preOrder: [
          preOrderAThird - this._windowHeight, preOrderTwoThirds
        ]
      };

      for (let key in ranges) {
        let [min, max] = ranges[key];
        let enteredClass = enteredClasses[key];
        if (!enteredClass) {
          if (this._pageYOffset >= min && this._pageYOffset <= max) {
            newEnteredClasses[key] = `is-SpendIndex-${key}-entered`;
          }
        } else if (isReset) {
          if (this._pageYOffset < min || this._pageYOffset > max) {
            newEnteredClasses[key] = '';
          }
        }
      }

      if (size(newEnteredClasses) > 0) {
        this.setState({
          enteredClasses: enteredClasses.merge(newEnteredClasses)
        });
      }
    },
    updateSideViewVideo() {
      /*
      let {duration} = this._sideViewVideoRef;

      if (!(Number.isNaN(duration)) && Modernizr.video) {
        let time;
        const TIME_MAX = Math.floor(duration);

        let {start, twoThirds} = this._pageYOffsets.measure;
        let min = twoThirds - this._windowHeight;
        let max = start;

        if (this._pageYOffset <= min) {
          time = 0;
        } else if (this._pageYOffset < max) {
          time = ((this._pageYOffset - min)/(max - min))*TIME_MAX;
        } else {
          time = TIME_MAX;
        }

        this._sideViewVideoRef.currentTime = time;
      }
      */
    },

    calcPageYOffsets() {
      const KEYS = {
        index: ['twoThirds'],
        contactless: ['half', 'oneThird', 'twoThirds'],
        physicalCards: ['half', 'oneThird', 'twoThirds'],
        design: ['half', 'oneThird', 'twoThirds'],
        charge: ['half', 'oneThird', 'twoThirds'],
        tech: ['oneThird', 'twoThirds'],
        app: ['half', 'oneThird', 'twoThirds'],
        preOrder: ['oneThird', 'twoThirds']
      };

      this._pageYOffsets = {};

      for (let sectionKey in KEYS) {
        let pageYOffsets = this._pageYOffsets[sectionKey] = {};
        let {top, bottom} = this._sectionRefs[sectionKey]
          .getBoundingClientRect();
        let height = bottom - top;

        KEYS[sectionKey].forEach(key => {
          let value = this._pageYOffset + top;
          switch (key) {
          case 'start': break;
          case 'half': value += height/2; break;
          case 'oneThird': value += height/3; break;
          case 'twoThirds': value += height*(2/3); break;
          default:
            // TODO: error
            break;
          }
          pageYOffsets[key] = value;
        });
      }
    },
    offsetY2Style(offsetY) {
      return offsetY ? {
        WebkitTransform: `translate3d(0,${offsetY}%,0)`,
        transform: `translate3d(0,${offsetY}%,0)`
      } : null;
    },
    pauseIndexVideoAtTime(time) {
      if (Modernizr.video) {
        this._indexVideoRef.currentTime = time;
        if (!(this._indexVideoRef.paused)) {
          this._indexVideoRef.pause();
        }
      }
    },
    componentDidMount() {
      //window.location.href = "http://igg.me/at/spendwallet"
      this._securitySwipe = new Swipe(this._securitySliderRef, {
        callback: (index, el) => {
          this.setState({securitySwipePos: index});
        }
      });
    },
    componentDidUpdate(prevProps, prevState) {
      /*if (Modernizr.video) {
        const indexEntered = this.state.enteredClasses.index;
        if (prevState.enteredClasses.index !== indexEntered) {
          let indexVideoDuration = this._indexVideoRef.duration;
          switch (indexEntered) {
          case '':
            this.pauseIndexVideoAtTime(0);
            break;
          case 'is-SpendIndex-index-entered':
            this._indexVideoRef.play();
            break;
          case 'is-SpendIndex-index-entered-done':
            if (!(Number.isNaN(indexVideoDuration))) {
              this.pauseIndexVideoAtTime(Math.floor(indexVideoDuration));
            }
            break;
          default:
            // TODO: error
            break;
          }
        }
      }*/
    },
    handleIndexVideoLoadedMetadata(e) {
      if (this.state.enteredClasses.index === 'is-SpendIndex-index-entered-done') {
        this.pauseIndexVideoAtTime(
          Math.floor(this._indexVideoRef.duration)
        );
      }
    },
    handleNewSubscription({email}) {
      this.props.onNewSubscription(email)
        .then(() => {
          this.setState({
            subscriptionMsg: Immutable({
              className: 'SpendIndex-Form-MessageBoard-success',
              content: 'https://s3.ap-northeast-2.amazonaws.com/spendwallet/spendwallet.com/email_check.png',
              isFading: true
            })
          });
          this._formRef.reset();
        }, error => {
          this.setState({
            subscriptionMsg: Immutable({
              className: 'SpendIndex-Form-MessageBoard-error',
              content: 'https://s3.ap-northeast-2.amazonaws.com/spendwallet/spendwallet.com/email_plane.png',
              isFading: false
            })
          });
        });
    },
    handleScreenChange(prevScreen, screen) {
      let isScreenMdPrev = this._isScreenMd;
      let isInit = (typeof isScreenMdPrev !== 'boolean');

      this._isScreenMd = (screen >= WindowListener.SCREEN_NAMES.MD);

      if ((isInit || !isScreenMdPrev) && this._isScreenMd) {
        this.updateAnimated(!isInit);
      } else if ((isInit || isScreenMdPrev) && !this._isScreenMd) {
        this.setSmallScreenState();
      }
    },
    handleSecuritySliderPrevClick(e) {
      this._securitySwipe.prev();
    },
    handleSecuritySliderNextClick(e) {
      this._securitySwipe.next();
    },
    handleSideViewVideoLoadedMetadata(e) {
      // TEMP
      this._sideViewVideoRef.currentTime = 0;
      // this.updateSideViewVideo();
    },
    handleWindowResize({width, height}) {
      this._windowHeight = height;
      if (typeof this._pageYOffset === 'number') {
        this.calcPageYOffsets();
      }
      this.updateAnimated();
    },
    handleWindowScroll({pageYOffset}) {
      this._pageYOffset = pageYOffset;
      if (!this._pageYOffsets) {
        this.calcPageYOffsets();
      }
      this.updateAnimated();
    },
    makeSectionRefsHandler(name) {
      return (ref => {
        if (!this._sectionRefs) {
          this._sectionRefs = {};
        }
        this._sectionRefs[name] = ref;
      });
    },



  render() {
      const {
        bgYOffsets,
        enteredClasses,
        subscriptionMsg
      } = this.state;
      const {
        contactless: contactlessBgY,
        physicalCards: physicalCardsBgY,
        design: designBgY,
        charge: chargeBgY,
        app: appBgY,
        preOrder: preOrderBgY
      } = bgYOffsets;
      const {
        index: indexEnteredClass,
        contactless: contactlessEnteredClass,
        physicalCards: physicalCardsEnteredClass,
        design: designEnteredClass,
        charge: chargeEnteredClass,
        tech: techEnteredClass,
        app: appEnteredClass,
        preOrder: preOrderEnteredClass
      } = enteredClasses;

      let overflowStyle = this._isScreenMd ?
        {overflow: 'hidden'} :
        null;

      let {formatMessage} = this.context.intl;

    return (
      <div className="SpendIndex">
        <Helmet title={CONF.BRAND} />
        <WindowListener
          onResize={this.handleWindowResize}
          onScreenChange={this.handleScreenChange}
          onScroll={this.handleWindowScroll} />
        <div className="container-fluid SpendIndex-container">

          <section
            className={classNames('AsteraIndex-Main', indexEnteredClass)}
            style={overflowStyle}
            ref={this.makeSectionRefsHandler('index')}
          >
            <div className="AsteraIndex-inner">
              <div className="AsteraIndex-content">
                <div className="AsteraIndex-text-group">
                  <FormattedHTMLMessage id="index.heading.fat">
                    <h1 className="AsteraIndex-text-h1"/>
                  </FormattedHTMLMessage>
                  <FormattedHTMLMessage id="index.heading">
                    <p className="AsteraIndex-text-p"/>
                  </FormattedHTMLMessage>
                  <div className="AsteraIndex-Main-Circle">
                    <img src="https://s3.ap-northeast-2.amazonaws.com/astera/ASTERA.com/background-circle.png" alt="Circle" />
                  </div>
                </div>
                <div className="AsteraIndex-Form-group">
                  <Form
                    className="AsteraIndex-Form"
                    action="/subscriptions" onSubmit={this.handleNewSubscription}
                    ref={ref => {
                      this._formRef = ref;
                    }}
                  >
                    <Input className="AsteraIndex-Form-email" type="email" name="email" placeholder={formatMessage({id: 'emailPlaceholder'})} />
                    <Button className="AsteraIndex-Form-submit" type="submit">
                      <FormattedHTMLMessage id="index.newsletter.submit">
                        <h2 className="AsteraIndex-Form-submit-text"/>
                      </FormattedHTMLMessage>
                    </Button>
                  </Form>
                </div>
              </div>
            </div>
          </section>

          <section className={classNames('AsteraIndex-descrip')}>
            <div className="AsteraIndex-descrip-text-group">
              <div className="AsteraIndex-descrip-hardware">
                <img class="AsteraIndex-descrip-hardware" src="https://s3.ap-northeast-2.amazonaws.com/astera/ASTERA.com/Astera_Hardware_view.png" alt="Hardware"/>
              </div>
              <FormattedHTMLMessage id="index.charge.description">
                <h1 className="AsteraIndex-descrip-text-h1"/>
              </FormattedHTMLMessage>
            </div>
          </section>

          <section className={classNames('AsteraIndex-subscrib')}>
              <div className="AsteraIndex-subscrib-text-group">
                <h1 className="AsteraIndex-subscrib-h1">
                  {formatMessage({id: 'index.newsletter.heading'})}
                </h1>
              </div>
            <div className="AsteraIndex-Form-group center">
              <Form
                className="AsteraIndex-Form"
                action="/subscriptions" onSubmit={this.handleNewSubscription}
                ref={ref => {
                  this._formRef = ref;
                }}
              >
                <Input className="AsteraIndex-Form-email" type="email" name="email" placeholder={formatMessage({id: 'emailPlaceholder'})} />
                <Button className="AsteraIndex-Form-submit" type="submit">
                  <FormattedHTMLMessage id="index.newsletter.submit">
                    <h2 className="AsteraIndex-Form-submit-text"/>
                  </FormattedHTMLMessage>
                </Button>
              </Form>
            </div>
          </section>

        </div>
      </div>
    );
  },
});

module.exports = SpendIndex;
