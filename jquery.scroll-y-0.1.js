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
    stickyNav: true,
    blocks: '.block',
    duration: 800
  }, options);

  var $active;
  var $window = $(window);
  var $nav = $(this);
  var ogNavPos = $nav.offset().top - $window.scrollTop();
  var $links = $nav.find('a');
  var $blocks = $(settings.blocks);
  // Handler each time the window scrolls
  $window.on('scroll', activeNav);
  $window.on('scroll', stickyNav);
  // Handler each time a user clicks on a nav <a>
  $links.on('click', scrollToBlock);
  // Function to figure out which nav item is currently in view
  function activeNav(){
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
        var activeBotPos = ($active.offset().top - $window.scrollTop() + $nav.height()) + $active.height()
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
  };
  // Scrolls to the section the user clicks
  function scrollToBlock(){
    // Grab the hash value for the target <a> and remove the '#'
    var blockName = $(this).attr('href').replace('#','');
    // Scroll down to the <a> anchor which corresponds to the item clicked 
    // on in the nav
    $('body, html').animate({
      scrollTop: $('a[name='+ blockName +']').offset().top
    }, settings.duration);
    // Prevent default link behavior
    return false;
  };
  // Sticky nav bar
  function stickyNav(){
    // Make sure we want the nav to stick to the top of the window
    if(settings.stickyNav == true){
      // If the top of the nav bar hits the top of the window change it's position to fixed
      if($nav.offset().top - $window.scrollTop() <= 0){
        $nav.css({
          position:'fixed',
          top: '0px'
        });
      };
      // Puts the nav back into it's old place in the DOM once the nav reaches it's old position
      if(ogNavPos > $window.scrollTop()){
        $nav.css({
          position:'relative',
          top: 'inherit'
        });
      };
    };
  };
  return this;
};

}(jQuery));