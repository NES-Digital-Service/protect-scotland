const {
  DetoxCircusEnvironment,
  SpecReporter,
  WorkerAssignReporter
} = require('detox/runners/jest-circus');

class CustomDetoxEnvironment extends DetoxCircusEnvironment {
  constructor(config) {
    super(config);

    this.registerListeners({
      SpecReporter,
      WorkerAssignReporter
    });
  }
}

module.exports = CustomDetoxEnvironment;
