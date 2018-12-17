module.exports = class TimeParser {
  static parse(timeString) {
    let match = timeString.match(/(.+)(s|ms|h)/);
    const unit = match[2];
    let value = parseFloat(match[1]);

    switch (unit) {
      case "s":
        value = value * 1000;
        break;
      case "h":
        value = value * 60 * 60 * 1000;
        break;
    }
    return value;
  }
};
