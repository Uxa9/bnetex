const EventEmitter = require('events');
const simulateEventer = new EventEmitter();

const nextCalculatedKline = new EventEmitter();

const tgEvents = new EventEmitter();

module.exports.simulateEventer = simulateEventer;

module.exports.tgEvents = tgEvents;


module.exports.nextCalculatedKline = nextCalculatedKline;