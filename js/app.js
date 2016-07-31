var clock = new Clock();

function launchFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }
}

var originalX = $(window).width() / 2;
var $ul = $('#ruler').find('ul');

$('#pointer').css('left', originalX - 4);

function generateRuler() {
  
  for (var i = 0; i <= 100; i++) {
    var numberType = 1;
    if (i % 10 === 0) {
      numberType = 10;
    } else if (i % 5 === 0) {
      numberType = 5;
    }
   
    var html = '<li>' + 
        '<div class="mark mark-' + numberType + '"></div>' +
        (numberType !== 1 ? 
        '<span class="number number-' + numberType + '' + (i < 10 ? ' less-than-10' : '') + '">' + i + '</span>' : 
        '') +
        '</li>';
    
    $(html).appendTo($ul);
  }

  $ul.css('margin-left', originalX);
}
generateRuler();

ion.sound({
  sounds: [
    {
      name: 'beep',
    }
  ],
  path: 'audio/',
  preload: true
});


var countDownStart = null;
var countDownStartDate = null;
var countDown = null;
var countDownInterval = null;
var startDate = null;

var startTouchX = null;
var startRulerX = null;

var alarmInterval = null;
var alarmState = 0;
var alarm = false;

function displayCountDown() {
  var minutes = Math.floor(countDown / 60);
  var second = Math.floor(countDown - minutes * 60);
  clock.mode = 'countdown';
  clock.dispaly(minutes, second);
  $ul.css('margin-left', originalX - countDown / 60 * 8);
}

$(document).on('touchstart', function(e) {
  launchFullscreen(document.documentElement);
  if (countDownInterval !== null) {
    clearInterval(countDownInterval);
  }
  if (alarm) {
    alarm = false;
    countDown = null;
    $('#stopwatch').css('opacity', 0.1);
    if (alarmInterval !== null) {
      clearInterval(alarmInterval);
    }
    ion.sound.stop('beep');
    clock.mode = 'time';
  }
  startTouchX = e.changedTouches[0].pageX;
  startRulerX = parseInt($ul.css('margin-left').replace('px', ''));
  $('#stopwatch').css('opacity', 1);
});

$(document).on('touchmove', function(e) {
  var newX = startRulerX + (e.changedTouches[0].pageX - startTouchX);
  if (newX > originalX) {
    newX = originalX;
  } else if (newX < originalX - 799) {
    newX = originalX - 799;
  }

  $('#ruler').find('ul').css('margin-left', newX);

  countDownStartDate = new Date();
  countDown = (originalX - newX) / 8 * 60;
  countDownStart = countDown;

  displayCountDown();
});

$(document).on('touchend', function(e) {
  if (countDown <= 0) {
    countDown = null;
    clock.mode = 'time';
    $('#stopwatch').css('opacity', 0.1);
    return;
  }
  startDate = new Date();
  if (countDownInterval !== null) {
    clearInterval(countDownInterval);
  }
  countDownInterval = setInterval(function() {
    countDown = countDownStart - (new Date() - countDownStartDate) / 1000;
    if (countDown <= 0) {
      if (!alarm) {
        clearInterval(countDownInterval);
        if (alarmInterval !== null) {
          clearInterval(alarmInterval);
        }
        alarmInterval = setInterval(function() {
          if (alarmState === 0) {
            clock.dispaly(88, 88);
            alarmState = 1;
            ion.sound.play('beep');
          } else {
            clock.dispaly('', '');
            alarmState = 0;
          }
        }, 500);
        alarm = true;
      }
    } else {
      clearInterval(alarmInterval);
      displayCountDown();
    }
  }, 100);
});