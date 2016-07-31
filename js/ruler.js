function Ruler() {
  this.originalX = $(window).width() / 2;
  this.$ul = $('#ruler').find('ul');

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
    
    $(html).appendTo(this.$ul);
  }

  this.$ul.css('margin-left', this.originalX);
  $('#pointer').css('left', this.originalX - 4);

}