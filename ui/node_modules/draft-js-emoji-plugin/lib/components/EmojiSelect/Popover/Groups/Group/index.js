'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Entry = require('../../Entry');

var _Entry2 = _interopRequireDefault(_Entry);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Group = function (_Component) {
  _inherits(Group, _Component);

  function Group() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, Group);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Group.__proto__ || Object.getPrototypeOf(Group)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      hasRenderedEmoji: false
    }, _this.shouldComponentUpdate = function (nextProps) {
      if (_this.state.hasRenderedEmoji) {
        return false;
      }

      return nextProps.isActive;
    }, _this.renderCategory = function (category) {
      var _this$props = _this.props,
          cacheBustParam = _this$props.cacheBustParam,
          imagePath = _this$props.imagePath,
          imageType = _this$props.imageType,
          _this$props$theme = _this$props.theme,
          theme = _this$props$theme === undefined ? {} : _this$props$theme,
          emojis = _this$props.emojis,
          checkMouseDown = _this$props.checkMouseDown,
          onEmojiSelect = _this$props.onEmojiSelect,
          onEmojiMouseDown = _this$props.onEmojiMouseDown,
          useNativeArt = _this$props.useNativeArt,
          isActive = _this$props.isActive;


      var categoryEmojis = emojis[category];

      return Object.keys(categoryEmojis).map(function (key) {
        return _react2.default.createElement(
          'li',
          {
            key: categoryEmojis[key][0],
            className: theme.emojiSelectPopoverGroupItem
          },
          isActive && _react2.default.createElement(_Entry2.default, {
            emoji: categoryEmojis[key][0],
            theme: theme,
            imagePath: imagePath,
            imageType: imageType,
            cacheBustParam: cacheBustParam,
            toneSet: categoryEmojis[key].length > 1 ? categoryEmojis[key] : null,
            checkMouseDown: checkMouseDown,
            onEmojiSelect: onEmojiSelect,
            onEmojiMouseDown: onEmojiMouseDown,
            useNativeArt: useNativeArt
          })
        );
      });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Group, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.props.isActive) {
        this.setState({ hasRenderedEmoji: true }); // eslint-disable-line
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          _props$theme = _props.theme,
          theme = _props$theme === undefined ? {} : _props$theme,
          group = _props.group;


      return _react2.default.createElement(
        'section',
        {
          className: theme.emojiSelectPopoverGroup,
          ref: function ref(element) {
            _this2.container = element;
          }
        },
        _react2.default.createElement(
          'h3',
          { className: theme.emojiSelectPopoverGroupTitle },
          group.title
        ),
        _react2.default.createElement(
          'ul',
          {
            className: theme.emojiSelectPopoverGroupList,
            ref: function ref(element) {
              _this2.list = element;
            }
          },
          group.categories.map(function (category) {
            return _this2.renderCategory(category);
          })
        )
      );
    }
  }]);

  return Group;
}(_react.Component);

Group.propTypes = {
  cacheBustParam: _propTypes2.default.string.isRequired,
  imagePath: _propTypes2.default.string.isRequired,
  imageType: _propTypes2.default.string.isRequired,
  theme: _propTypes2.default.object.isRequired,
  group: _propTypes2.default.object.isRequired,
  emojis: _propTypes2.default.object.isRequired,
  checkMouseDown: _propTypes2.default.func.isRequired,
  onEmojiSelect: _propTypes2.default.func.isRequired,
  onEmojiMouseDown: _propTypes2.default.func.isRequired,
  useNativeArt: _propTypes2.default.bool,
  isActive: _propTypes2.default.bool
};
exports.default = Group;