/**
 * Clock
 */
function Clock() {
  var context = this;

  this.mode = 'time';

  this.alarmInterval = null;
  this.alarmState = 0;

  ion.sound({
    sounds: [
      {
        name: 'beep',
      }
    ],
    path: 'audio/',
    preload: true
  });

  setInterval(function() {
    if (context.mode === 'time') {
      context.clockTick();
    }
  }, 1000);
}

/**
 * Display
 * @param high high digit
 * @param low low digit
 */
Clock.prototype.dispaly = function(high, low) {
  $('#digit-high').text(this.validateNumber(high) ? this.formatNumber(high) : this.formatString(high));
  $('#digit-low').text(this.validateNumber(low) ? this.formatNumber(low) : this.formatString(low));
};

/**
 * Validate number
 * @param {String|Number} number the number need to be validated
 * @returns {Boolean} whether the number is validate
 */
Clock.prototype.validateNumber = function(number) {
  return Number.isInteger(number) && number >= 0 && number <= 99;
};

/**
 * Format number, add '0' if the number is less than 10
 * @param {Number} number the number need to be formated
 * @returns {Number} formatted number
 */
Clock.prototype.formatNumber = function(number) {
  return number < 10 ? '0' + number : number;
};

/**
 * Format string, just use first 2 char
 * @param {String} number the number need to be formated
 * @returns {String} formatted number
 */
Clock.prototype.formatString = function(string) {
  return (string + '').substring(0, 2);
};

/**
 * Clock tick
 */
Clock.prototype.clockTick = function() {
  var date = new Date();
  this.dispaly(date.getHours(), date.getMinutes());
  this.toggleColon();
};

/**
 * Toggle the colon
 */
Clock.prototype.toggleColon = function() {
  $('#digit-colon').css('opacity', $('#digit-colon').css('opacity') == 1 ? 0.1 : 1);
};

Clock.prototype.startAlarm = function() {
  this.alarmInterval = setInterval(function() {
    if (this.alarmState === 0) {
      ion.sound.play('beep');
      this.dispaly(88, 88);
      this.alarmState = 1;
    } else {
      this.dispaly('', '');
      this.alarmState = 0;
    }
  }, 500);
};