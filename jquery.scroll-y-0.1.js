/*
* jQuery Scroll-y
*
* Author: Sean Harvey - sean-harvey.info
* Date: 05/17/2013
* Version: 0.1
*/
(function($){

$.fn.scrolly = function(options){
  // Setup defaults (more to come)
  var settings = $.extend({
    blocks: $(".block")
  }, options);

  var $active;
  var $window = $(window);
  var $page = $(document.body);
  var $nav = $(this);
  var $blocks = $(settings.blocks);
  // Handler each time the window scrolls
  $window.on('scroll', function(){
    var first = true;
    $blocks.each(function(i){ 
    	// Setup top & bottom position variables for the current block in the loop
    	var blockTopPos = $(this).offset().top - ($window.scrollTop() + $nav.height());
    	var blockBotPos = $(this).offset().top - ($window.scrollTop() + $nav.height()) + $(this).height();
    	// If we're on the first block set $active to the first block in the loop
      if(first == true){ 
        $active = $(this);
        first = false;
        $nav.find('a.active').removeClass('active');
        $nav.find('a.' + $active.prev().attr('name')).addClass('active');
      } else {
      	// Setup top & bottom position variables for the $active block in the loop
      	var activeTopPos = $active.offset().top - ($window.scrollTop() + $nav.height());
    	var activeBotPos = ($active.offset().top - $window.scrollTop() + $nav.height()) + $active.height();

    	// If $active block's bottom edge is past the bottom of the nav or the current block in the loop
    	// is less than or equal to the nav's bottom edge, move on
        if(activeBotPos < $nav.height() || blockTopPos <= $nav.height()){
          // If the current loop block's bottom edge is below the bottom edge of the nav and $active block's
          // bottom edge is past the nav's bottom edge set the current loop block to active and update it's 
          // corresponding nav <a> with a class of "active"
          if(blockBotPos > $nav.height() && activeBotPos <= $nav.height()){
            $active = $(this);
            $nav.find('a.active').removeClass('active');
            $nav.find('a.' + $active.prev().attr('name')).addClass('active');
          }
        }
      }
    });
  });
  return this;
};

}(jQuery));
