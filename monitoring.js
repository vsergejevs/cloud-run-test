/* monitoring.js */
'use strict';

const { MeterProvider } = require('@opentelemetry/sdk-metrics-base');

const {
  MetricExporter,
} = require('@google-cloud/opentelemetry-cloud-monitoring-exporter');

const meter = new MeterProvider({
  exporter: new MetricExporter(),
  interval: 1000,
}).getMeter('example-meter');

const requestCount = meter.createCounter('requests', {
  description: 'Count all incoming requests',
});

const boundInstruments = new Map();

module.exports.countAllRequests = () => {
  return (req, res, next) => {
    if (!boundInstruments.has(req.path)) {
      const labels = { route: req.path };
      const boundCounter = requestCount.bind(labels);
      boundInstruments.set(req.path, boundCounter);
    }

    boundInstruments.get(req.path).add(1);
    next();
  };
};
