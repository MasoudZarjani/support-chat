'use strict';

var _momentJalaali = require('moment-jalaali');

var _momentJalaali2 = _interopRequireDefault(_momentJalaali);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getPersianDate(date) {
    var now = new Date().toISOString().split("T")[0];
    if (date == now) {
        return (0, _momentJalaali2.default)(date).fromNow();
    } else {
        return (0, _momentJalaali2.default)(date).format('jD jMMMM jYYYY');
    }
}