'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _smileO = require('react-icons/lib/fa/smile-o');

var _smileO2 = _interopRequireDefault(_smileO);

var _paw = require('react-icons/lib/fa/paw');

var _paw2 = _interopRequireDefault(_paw);

var _cutlery = require('react-icons/lib/fa/cutlery');

var _cutlery2 = _interopRequireDefault(_cutlery);

var _futbolO = require('react-icons/lib/fa/futbol-o');

var _futbolO2 = _interopRequireDefault(_futbolO);

var _plane = require('react-icons/lib/fa/plane');

var _plane2 = _interopRequireDefault(_plane);

var _bell = require('react-icons/lib/fa/bell');

var _bell2 = _interopRequireDefault(_bell);

var _heart = require('react-icons/lib/fa/heart');

var _heart2 = _interopRequireDefault(_heart);

var _flag = require('react-icons/lib/fa/flag');

var _flag2 = _interopRequireDefault(_flag);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultEmojiGroups = [{
  title: 'People',
  icon: _react2.default.createElement(_smileO2.default, { style: { verticalAlign: '' } }),
  categories: ['people']
}, {
  title: 'Nature',
  icon: _react2.default.createElement(_paw2.default, { style: { verticalAlign: '' } }),
  categories: ['nature']
}, {
  title: 'Food & Drink',
  icon: _react2.default.createElement(_cutlery2.default, { style: { verticalAlign: '' } }),
  categories: ['food']
}, {
  title: 'Activity',
  icon: _react2.default.createElement(_futbolO2.default, { style: { verticalAlign: '' } }),
  categories: ['activity']
}, {
  title: 'Travel & Places',
  icon: _react2.default.createElement(_plane2.default, { style: { verticalAlign: '' } }),
  categories: ['travel']
}, {
  title: 'Objects',
  icon: _react2.default.createElement(_bell2.default, { style: { verticalAlign: '' } }),
  categories: ['objects']
}, {
  title: 'Symbols',
  icon: _react2.default.createElement(_heart2.default, { style: { verticalAlign: '' } }),
  categories: ['symbols']
}, {
  title: 'Flags',
  icon: _react2.default.createElement(_flag2.default, { style: { verticalAlign: '' } }),
  categories: ['flags']
}];

exports.default = defaultEmojiGroups;