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
let Markdown = require('../markdown');
let MessageBoard = require('../messageBoard');
let WindowListener = require('../windowListener');

let IndiegogoLink = require('./indiegogoLink');
let Logo = require('./logo');

let Immutable = require('seamless-immutable');

let SpendIndex = React.createClass({
  statics: {
    BG_OFFSET_Y_MAX: 25,
    DEFAULT_BG_Y_OFFSETS: Immutable({
      contactless: 0,
      physicalCards: 0,
      design: 0,
      display: 0,
      charge: 0,
      tech: 0,
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
      name: 'Bank Level Encyrption',
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
        tech: ''
      }),
      securitySwipePos: 0,
      subscriptionMsg: null
    };
  },

  setSmallScreenState() {
    let state = {
      enteredClasses: Immutable({
        index: 'is-SpendIndex-index-entered-done',
        tech: 'is-SpendIndex-tech-entered-done'
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
      half: displayHalf, oneThird: displayAThird
    } = this._pageYOffsets.display;
    let {
      half: chargeHalf, oneThird: chargeAThird
    } = this._pageYOffsets.charge;
    let {
      half: techHalf, twoThirds: techTwoThirds
    } = this._pageYOffsets.tech;
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
      display: [
        displayAThird - this._windowHeight, displayHalf - halfHeight
      ],
      charge: [
        chargeAThird - this._windowHeight, chargeHalf - halfHeight
      ],
      tech: [
        techTwoThirds - this._windowHeight, techHalf - halfHeight
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
      case 'tech':
        bgOffsetY = -bgOffsetY;
        break;
      case 'preOrder':
        bgOffsetY = bgOffsetY*2 - BG_OFFSET_Y_MAX;
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
      oneThird: techAThird, twoThirds: techTwoThirds
    } = this._pageYOffsets.tech;

    let ranges = {
      index: [0, this._pageYOffsets.index.twoThirds],
      tech: [techAThird - this._windowHeight, techTwoThirds]
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
      contactless: ['half', 'oneThird'],
      physicalCards: ['half', 'oneThird'],
      measure: ['start', 'twoThirds'],
      design: ['half', 'oneThird'],
      display: ['half', 'oneThird'],
      charge: ['half', 'oneThird'],
      tech: ['half', 'oneThird', 'twoThirds'],
      app: ['half', 'oneThird'],
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
  offsetY2Style(offsetY, opacity = null) {
    if (offsetY) {
      let style = {
        WebkitTransform: `translate3d(0,${offsetY}%,0)`,
        transform: `translate3d(0,${offsetY}%,0)`
      };

      if (typeof opacity === 'number') {
        style.opacity = opacity;
      }

      return style;
    } else {
      return null;
    }
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
    this._securitySwipe = new Swipe(this._securitySliderRef, {
      callback: (index, el) => {
        this.setState({securitySwipePos: index});
      }
    });
  },
  componentDidUpdate(prevProps, prevState) {
    if (Modernizr.video) {
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
    }
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
            content: 'Thank you for your subscription.',
            isFading: true
          })
        });
        this._formRef.reset();
      }, error => {
        this.setState({
          subscriptionMsg: Immutable({
            className: 'SpendIndex-Form-MessageBoard-error',
            content: error.message,
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
      display: displayBgY,
      charge: chargeBgY,
      tech: techBgY,
      app: appBgY,
      preOrder: preOrderBgY
    } = bgYOffsets;
    const {
      index: indexEnteredClass, tech: techEnteredClass
    } = enteredClasses;

    let {formatMessage} = this.context.intl;
    let overflowStyle = this._isScreenMd ?
      {overflow: 'hidden'} :
      null;
    const {BG_OFFSET_Y_MAX} = SpendIndex;

    return (
      <div className="SpendIndex">
        <Helmet title={CONF.BRAND} />
        <WindowListener
          onResize={this.handleWindowResize}
          onScreenChange={this.handleScreenChange}
          onScroll={this.handleWindowScroll} />

        <div className="container-fluid SpendIndex-container">
          <section
            className={classNames('SpendIndex-index', indexEnteredClass)}
            style={overflowStyle}
            ref={this.makeSectionRefsHandler('index')}
          >
            <div className="SpendIndex-index-inner">
              <header className="SpendIndex-index-header text-center">
                <h1 className="SpendIndex-h1">
                  <Logo className="SpendIndex-h1-Logo" />
                </h1>
                <LinkBlock className="SpendIndex-h1-LinkBlock">
                  <IndiegogoLink eventLabel="In Index Page Index Section" />
                </LinkBlock>
              </header>
              <div className="SpendIndex-index-content">
                <div className="SpendIndex-link-video-group">
                  <h2 className="SpendIndex-link-video-h2">
                    {formatMessage({id: 'index.heading'})}
                  </h2>
                  <LinkBlock className="SpendIndex-video-LinkBlock">
                    <a className="SpendIndex-link SpendIndex-link-video text-uppercase"><i className="fa fa-Spend-caret-right SpendIndex-link-video-icon" /> {formatMessage({id: 'index.button.video'})}</a>
                  </LinkBlock>
                </div>
                <div className="SpendIndex-Form-group">
                  <Form
                    className="SpendIndex-Form"
                    action="/subscriptions" onSubmit={this.handleNewSubscription}
                    ref={ref => {
                      this._formRef = ref;
                    }}
                  >
                    <Input className="SpendIndex-Form-email" type="email" name="email" placeholder={formatMessage({id: 'emailPlaceholder'})} />
                    <Button className="SpendIndex-Form-submit" type="submit"><i className="fa fa-Spend-paper-plane SpendIndex-Form-submit-icon" /></Button>
                  </Form>
                  <MessageBoard
                    className="SpendIndex-Form-MessageBoard"
                    message={subscriptionMsg}
                  >
                    {formatMessage({id: 'index.formMessageBoard'})}
                  </MessageBoard>
                </div>
              </div>
            </div>
            <div className="SpendIndex-index-bg">
              <video
                className="SpendIndex-index-bg-video"
                width="1440" height="806"
                poster="//dummyimage.com/683x403/ff/ff.png"
                onLoadedMetadata={this.handleIndexVideoLoadedMetadata}
                ref={ref => {
                  this._indexVideoRef = ref;
                }}
              >
                <source src="/videos/Main4_h.264.mp4" type="video/mp4" />
              </video>
            </div>
          </section>
          <section
            className="SpendIndex-contactless"
            style={overflowStyle}
            ref={this.makeSectionRefsHandler('contactless')}
          >
            <div className="SpendIndex-contactless-inner">
              <div
                className="SpendIndex-offsetY-opacity"
                style={this.offsetY2Style(
                  -(contactlessBgY/2),
                  (BG_OFFSET_Y_MAX - contactlessBgY)/BG_OFFSET_Y_MAX
                )}
              >
                <FormattedHTMLMessage id="index.contactless.header">
                  <header className="SpendIndex-contactless-header" />
                </FormattedHTMLMessage>
                <article className="SpendIndex-contactless-article">
                  <Markdown>
                    {formatMessage({id: 'index.contactless.paragraphs'})}
                  </Markdown>
                </article>
              </div>
            </div>
            <div
              className="SpendIndex-contactless-bg SpendIndex-offsetY"
              style={this.offsetY2Style(contactlessBgY)}
            >
              <div className="SpendIndex-contactless-bg-inner" />
            </div>
          </section>
          <section
            className="SpendIndex-physicalCards"
            style={overflowStyle}
            ref={this.makeSectionRefsHandler('physicalCards')}
          >
            <article className="SpendIndex-physicalCards-article">
              <Markdown
                className="SpendIndex-offsetY-opacity"
                style={this.offsetY2Style(
                  -(physicalCardsBgY/2),
                  (BG_OFFSET_Y_MAX - physicalCardsBgY)/BG_OFFSET_Y_MAX
                )}
              >
                {formatMessage({id: 'index.physicalCards.article'})}
              </Markdown>
            </article>
            <div
              className="SpendIndex-physicalCards-bg SpendIndex-offsetY"
              style={this.offsetY2Style(physicalCardsBgY)}
            >
              <div className="SpendIndex-physicalCards-bg-inner" />
            </div>
          </section>
          <section
            className="SpendIndex-design"
            style={overflowStyle}
            ref={this.makeSectionRefsHandler('design')}
          >
            <div className="SpendIndex-design-inner">
              <div
                className="SpendIndex-offsetY-opacity"
                style={this.offsetY2Style(
                  -(designBgY/2), (BG_OFFSET_Y_MAX + designBgY)/BG_OFFSET_Y_MAX
                )}
              >
                <h2 className="SpendIndex-design-h2">
                  {formatMessage({id: 'index.design.heading'})}
                </h2>
                <p className="SpendIndex-design-p SpendIndex-design-p-last">
                  {formatMessage({id: 'index.design.description'})}
                </p>
              </div>
            </div>
            <div
              className="SpendIndex-design-bg SpendIndex-offsetY"
              style={this.offsetY2Style(designBgY)}
            >
              <div className="SpendIndex-design-bg-inner" />
            </div>
          </section>
          <section
            className="SpendIndex-measure text-center"
            ref={this.makeSectionRefsHandler('measure')}
          >

              <FormattedHTMLMessage id="index.measure.heading">
                <h2 className="SpendIndex-measure-h2" />
              </FormattedHTMLMessage>
            <div className="SpendIndex-measure-sideView">
              <video
                className="SpendIndex-measure-sideView-video"
                width="1280" height="906"
                poster="//dummyimage.com/640x453/ff/ff.png"
                onLoadedMetadata={this.handleSideViewVideoLoadedMetadata}
                ref={ref => {
                  this._sideViewVideoRef = ref;
                }}
              >
                <source src="/videos/sideview2_h.264.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="SpendIndex-measure-numbers">
              <div className="SpendIndex-measure-numbers-big">
                {formatMessage({id: 'index.measure.dimensions'})}
              </div>
              <div className="SpendIndex-measure-numbers-more">
                {formatMessage({id: 'index.measure.dimensions2'})}
              </div>
            </div>
          </section>
          <section
            className="SpendIndex-display"
            style={overflowStyle}
            ref={this.makeSectionRefsHandler('display')}
          >
            <div className="SpendIndex-display-inner">
              <div
                className="SpendIndex-offsetY-opacity"
                style={this.offsetY2Style(
                  -(displayBgY/2), (BG_OFFSET_Y_MAX - displayBgY)/BG_OFFSET_Y_MAX
                )}
              >
                <h2 className="SpendIndex-display-h2">
                  {formatMessage({id: 'index.display.heading'})}
                </h2>
                <p className="SpendIndex-display-p SpendIndex-display-p-last">
                  {formatMessage({id: 'index.display.description'})}
                </p>
              </div>
            </div>
            <div
              className="SpendIndex-display-bg SpendIndex-offsetY"
              style={this.offsetY2Style(displayBgY)}
            >
              <div className="SpendIndex-display-bg-inner" />
            </div>
          </section>
          <section
            className="SpendIndex-charge"
            style={overflowStyle}
            ref={this.makeSectionRefsHandler('charge')}
          >
            <div className="SpendIndex-charge-inner">
              <div
                className="SpendIndex-offsetY-opacity"
                style={this.offsetY2Style(
                  -(chargeBgY/2), (BG_OFFSET_Y_MAX + chargeBgY)/BG_OFFSET_Y_MAX
                )}
              >
                <div className="SpendIndex-charge-content">
                  <h2 className="SpendIndex-charge-h2">
                    {formatMessage({id: 'index.charge.heading'})}
                  </h2>
                  <p className="SpendIndex-charge-p">
                    {formatMessage({id: 'index.charge.description'})}
                  </p>
                </div>
                <ImageBlock className="SpendIndex-charge-ImageBlock">
                  <RImage
                    className="SpendIndex-charge-RImage"
                    src="/images/usbcharge.png" width={291} height={221} />
                </ImageBlock>
                <div className="SpendIndex-charge-battery">
                  {formatMessage({id: 'index.charge.batterylife'})}
                </div>
              </div>
            </div>
            <div
              className="SpendIndex-charge-bg SpendIndex-offsetY"
              style={this.offsetY2Style(chargeBgY)}
            >
              <div className="SpendIndex-charge-bg-inner" />
            </div>
          </section>
          <section
            className={classNames('SpendIndex-tech', techEnteredClass)}
            style={overflowStyle}
            ref={this.makeSectionRefsHandler('tech')}
          >
            <div className="SpendIndex-tech-bg">
              <div className="SpendIndex-tech-bg-inner" />
              <div className="SpendIndex-tech-bg-captions">
                <div
                  className="SpendIndex-tech-bg-caption
                    SpendIndex-tech-bg-caption-display"
                >
                  <div className="SpendIndex-tech-bg-caption-display-inner" />
                </div>
                <div
                  className="SpendIndex-tech-bg-caption
                    SpendIndex-tech-bg-caption-mfe"
                >
                  <div className="SpendIndex-tech-bg-caption-mfe-inner" />
                </div>
                <div
                  className="SpendIndex-tech-bg-caption
                    SpendIndex-tech-bg-caption-battery"
                >
                  <div className="SpendIndex-tech-bg-caption-battery-inner" />
                </div>
                <div
                  className="SpendIndex-tech-bg-caption
                    SpendIndex-tech-bg-caption-touch"
                >
                  <div className="SpendIndex-tech-bg-caption-touch-inner" />
                </div>
                <div
                  className="SpendIndex-tech-bg-caption
                    SpendIndex-tech-bg-caption-usb"
                >
                  <div className="SpendIndex-tech-bg-caption-usb-inner" />
                </div>
                <div
                  className="SpendIndex-tech-bg-caption
                    SpendIndex-tech-bg-caption-vibration"
                >
                  <div className="SpendIndex-tech-bg-caption-vibration-inner" />
                </div>
                <div
                  className="SpendIndex-tech-bg-caption
                    SpendIndex-tech-bg-caption-energy"
                >
                  <div className="SpendIndex-tech-bg-caption-energy-inner" />
                </div>
              </div>
            </div>
            <div
              className="SpendIndex-tech-inner SpendIndex-offsetY-opacity"
              style={this.offsetY2Style(
                -(techBgY/2), (BG_OFFSET_Y_MAX + techBgY)/BG_OFFSET_Y_MAX
              )}
            >
              <h2 className="SpendIndex-tech-h2">
                {formatMessage({id: 'index.electronicwallet.heading'})}
              </h2>
              <FormattedHTMLMessage id="index.electronicwallet.description">
                <header className="SpendIndex-tech-p SpendIndex-tech-p-last" />
              </FormattedHTMLMessage>
            </div>
          </section>
          {this.renderSecurity()}
          <section
            className="SpendIndex-app"
            style={overflowStyle}
            ref={this.makeSectionRefsHandler('app')}
          >
            <div className="SpendIndex-app-inner">
              <div
                className="SpendIndex-offsetY-opacity"
                style={this.offsetY2Style(
                  -(appBgY/2), (BG_OFFSET_Y_MAX - appBgY)/BG_OFFSET_Y_MAX
                )}
              >
                <h2 className="SpendIndex-app-h2">
                  <Logo /> {formatMessage({id: 'index.application.heading'})}
                </h2>
                <p className="SpendIndex-app-p">
                  {formatMessage({id: 'index.application.description'})}
                </p>
                <div className="SpendIndex-app-stores text-hide">
                  iOS Android
                </div>
              </div>
            </div>
            <div
              className="SpendIndex-app-bg SpendIndex-offsetY"
              style={this.offsetY2Style(appBgY)}
            >
              <div className="SpendIndex-app-bg-inner" />
            </div>
          </section>
          <section
            className="SpendIndex-preOrder"
            style={overflowStyle}
            ref={this.makeSectionRefsHandler('preOrder')}
          >
            <div className="SpendIndex-preOrder-inner">
              <div
                className="SpendIndex-offsetY-opacity"
                style={this.offsetY2Style(
                  Math.min(-(preOrderBgY/2), 0),
                  (BG_OFFSET_Y_MAX - preOrderBgY)/BG_OFFSET_Y_MAX
                )}
              >
                <h2 className="SpendIndex-preOrder-h2">
                  {formatMessage({id: 'index.preorder.heading'})}<br />
                  <em className="SpendIndex-preOrder-h2-em">{formatMessage({id: 'index.preorder.description'})}</em>
                </h2>
                <ImageBlock
                  className="SpendIndex-preOrder-ImageBlock text-center"
                >
                  <Image src="/images/fin-spend-2.png" width={293} height={235} />
                </ImageBlock>
                <LinkBlock className="SpendIndex-preOrder-LinkBlock">
                  <a className="SpendIndex-link SpendIndex-link-preOrder text-uppercase">{formatMessage({id: 'index.button.preorder'})}</a>
                </LinkBlock>
              </div>
            </div>
            <div className="SpendIndex-preOrder-bg">
              <div
                className="SpendIndex-preOrder-bg-inner SpendIndex-offsetY"
                style={this.offsetY2Style(preOrderBgY)} />
            </div>
          </section>
        </div>
      </div>
    );
  },
  renderSecurity() {
    const {securitySwipePos} = this.state;
    let {
      name: securitySwipeName
    } = SpendIndex.SECURITY_FEATURES[securitySwipePos];

    return (
      <section
        className="SpendIndex-security"
        ref={this.makeSectionRefsHandler('security')}
      >
        <div
          className="SpendIndex-security-slider invisible"
          ref={ref => {
            this._securitySliderRef = ref;
          }}
        >
          {this.renderSecurityFeatures(true)}
          <div className="SpendIndex-security-slider-buttons">
            <PseudoButton
              onClick={this.handleSecuritySliderPrevClick}
              clickEvent={{
                category: 'Slider',
                action: 'prev',
                label: `After Viewed "${securitySwipeName}"`
              }}
            >
              <span
                className={classNames('SpendIndex-security-arrow SpendIndex-security-arrow-left text-hide', {
                  hidden: securitySwipePos <= 0
                })}
              >
                Previous
              </span>
            </PseudoButton>
            <PseudoButton
              onClick={this.handleSecuritySliderNextClick}
              clickEvent={{
                category: 'Slider',
                action: 'next',
                label: `After Viewed "${securitySwipeName}"`
              }}
            >
              <span
                className={classNames('SpendIndex-security-arrow SpendIndex-security-arrow-right text-hide', {
                  hidden: securitySwipePos >= 2
                })}
              >
                Next
              </span>
            </PseudoButton>
          </div>
        </div>
        <div className="SpendIndex-security-flatten">
          {this.renderSecurityFeatures()}
        </div>
      </section>
    );
  },
  renderSecurityFeatures(isSlider = false) {
    let {formatMessage} = this.context.intl;
    return (
      <ul
        className={classNames('SpendIndex-security-features listUnstyled', (
          isSlider ?
            'SpendIndex-security-slider-features' :
            'clearfix'
        ))}
      >
        {SpendIndex.SECURITY_FEATURES
          .map(({key, name, description}) => (
            <li
              className={classNames(`SpendIndex-security-feature SpendIndex-security-feature-${key} text-center`, (
                isSlider ?
                  `SpendIndex-security-slider-feature SpendIndex-security-slider-feature-${key}` :
                  'pull-left'
              ))}
              key={key}
            >
              <div
                className={classNames('SpendIndex-security-feature-name', {
                  'SpendIndex-security-slider-feature-name': isSlider
                })}
              >
                {formatMessage({id: `index.security.${key}.name`})}
              </div>
              <Markdown
                className={classNames('SpendIndex-security-feature-desc', {
                  'SpendIndex-security-slider-feature-desc': isSlider
                })}
              >
                {formatMessage({id: `index.security.${key}.description`})}
              </Markdown>
            </li>
          ))}
      </ul>
    );
  }
});

module.exports = SpendIndex;
