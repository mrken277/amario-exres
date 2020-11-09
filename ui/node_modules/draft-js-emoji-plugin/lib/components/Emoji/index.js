'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _unionClassNames = require('union-class-names');

var _unionClassNames2 = _interopRequireDefault(_unionClassNames);

var _emojione = require('emojione');

var _emojione2 = _interopRequireDefault(_emojione);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Emoji = function Emoji(_ref) {
  var _ref$theme = _ref.theme,
      theme = _ref$theme === undefined ? {} : _ref$theme,
      cacheBustParam = _ref.cacheBustParam,
      imagePath = _ref.imagePath,
      imageType = _ref.imageType,
      className = _ref.className,
      decoratedText = _ref.decoratedText,
      useNativeArt = _ref.useNativeArt,
      props = _objectWithoutProperties(_ref, ['theme', 'cacheBustParam', 'imagePath', 'imageType', 'className', 'decoratedText', 'useNativeArt']);

  var shortName = _emojione2.default.toShort(decoratedText);

  var emojiDisplay = null;
  if (useNativeArt === true) {
    emojiDisplay = _react2.default.createElement(
      'span',
      {
        title: _emojione2.default.toShort(decoratedText)
      },
      props.children
    );
  } else {
    // short name to image url code steal from emojione source code
    var shortNameForImage = _emojione2.default.emojioneList[shortName].unicode[_emojione2.default.emojioneList[shortName].unicode.length - 1];
    var backgroundImage = 'url(' + imagePath + shortNameForImage + '.' + imageType + cacheBustParam + ')';
    var combinedClassName = (0, _unionClassNames2.default)(theme.emoji, className);

    emojiDisplay = _react2.default.createElement(
      'span',
      {
        className: combinedClassName,
        title: _emojione2.default.toShort(decoratedText),
        style: { backgroundImage: backgroundImage }
      },
      props.children
    );
  }

  return emojiDisplay;
};

exports.default = Emoji;