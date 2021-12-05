
(function($) {
  $.fn.typewriter = function() {
    this.each(function() {
      var $el = $(this),
        originHtml = $el.html(),
        step = 0;
      $el.html("");
      var timer = setInterval(function() {
        var next = originHtml.substr(step, 1);
        if (next == "&") {
          step = originHtml.indexOf(";", step) + 1
        } else if (next == "<") {
          step = originHtml.indexOf(">", step) + 1
        } else {
          step++
        }
        $el.html(originHtml.substring(0, step) + (step & 1 ? "_" : ""));
        if (step >= originHtml.length) {
          $el.html(originHtml);
          clearInterval(timer)
          timer = null;
        }
      }, 80)
    });
    return this
  }
})(jQuery);