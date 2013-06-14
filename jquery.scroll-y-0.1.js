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
  var $links = $nav.find('li a');
  var $blocks = $(settings.blocks);
  // Handler each time the window scrolls
  $window.on('scroll', activeNav);
  $window.on('scroll', stickyNav);
  // Handler each time a user clicks on a nav <a>
  $links.on('click', scrollToBlock);
  // Set active nav item when page loads
  $window.on('load', activeNav);
  // Function to figure out which nav item is currently in view
  function activeNav(){
    var first = true;
    // Grab the navs height
    var navHeight = $nav.height();
    // Add the top and bottom padding values to the overall height of the nav
    navHeight += parseInt($nav.css('padding-top').replace(/[a-zA-Z]/g,''));
    navHeight += parseInt($nav.css('padding-bottom').replace(/[a-zA-Z]/g,''));
    // Loop through all the blocks
    $blocks.each(function(i){ 
      // Get block height
      var blockHeight = $(this).height();
      // Account for any padding
      blockHeight += parseInt($(this).css('padding-top').replace(/[a-zA-Z]/g,''));
      blockHeight += parseInt($(this).css('padding-bottom').replace(/[a-zA-Z]/g,''));
      // Setup top & bottom position variables for the current block in the loop
      var blockTopPos = $(this).offset().top - ($window.scrollTop() + navHeight);
      var blockBotPos = $(this).offset().top - ($window.scrollTop() + navHeight) + blockHeight;
      // If we're on the first block set $active to the first block in the loop
      if(first == true){ 
        $active = $(this);
        first = false;
        $nav.find('a.active').removeClass('active');
        $nav.find('a.' + $active.prev().attr('name')).addClass('active');
      } else {
        // Setup top & bottom position variables for the $active block in the loop
        var activeTopPos = $active.offset().top - ($window.scrollTop() + navHeight);
        var activeBotPos = ($active.offset().top - $window.scrollTop() - navHeight * 2) + $active.height()
        // If $active block's bottom edge is past the bottom of the nav or the current block in the loop
        // is less than or equal to the nav's bottom edge, move on
        if(activeBotPos < navHeight || blockTopPos <= navHeight){
          // If the current loop block's bottom edge is below the bottom edge of the nav and $active block's
          // bottom edge is past the nav's bottom edge set the current loop block to active and update it's 
          // corresponding nav <a> with a class of "active"
          if(blockBotPos > navHeight && activeBotPos <= navHeight){
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
    // If the nav is sticky and the user is clicking a nav item before the 
    // the top of the window has scrolled past the nav we need to account 
    // for it's overall height including top & bottom padding values
    if(settings.stickyNav == true){
      // Grab the navs height
      var navHeight = $nav.height();
      // Add the top and bottom padding values to the overall height of the nav
      navHeight += parseInt($nav.css('padding-top').replace(/[a-zA-Z]/g,''));
      navHeight += parseInt($nav.css('padding-bottom').replace(/[a-zA-Z]/g,''));
      // Set the scrollTop value to the appropriate block's anchor top offset minus the nav's height
      var scrollTopVal = $('a[name='+ blockName +']').offset().top - navHeight;
    } else {
      // Otherwise if the nav is fixed just set the scrollTop to the top offset value of the block's anchor
      var scrollTopVal = $('a[name='+ blockName +']').offset().top;
    };
    // Scroll down to the <a> anchor which corresponds to the item clicked on in the nav
    if($window.width() > 768){
      $('body, html').animate({
        scrollTop: scrollTopVal
      }, settings.duration);
    } else {
      $('body, html').scrollTop(scrollTopVal);
    };
    // Prevent default link behavior
    return false;
  };
  // Sticky nav bar
  function stickyNav(){
    // Make sure we want the nav to stick to the top of the window
    if(settings.stickyNav == true){
      // Grab the navs height
      var navHeight = $nav.height();
      // Add the top and bottom padding values to the overall height of the nav
      navHeight += parseFloat($nav.css('padding-top').replace(/[a-zA-Z]/g,''));
      navHeight += parseFloat($nav.css('padding-bottom').replace(/[a-zA-Z]/g,''));
      // If the top of the nav bar hits the top of the window change it's position to fixed and give the body
      // the amount of padding equal to the height of the nav so the page doesn't jump
      if($nav.offset().top - $window.scrollTop() <= 0){
        $nav.css({
          position:'fixed',
          top: '0',
          width: '100%',
          'z-index': '700'
        });
        $('body').css({
          paddingTop: navHeight + 'px'
        });
      };
      // Puts the nav back into it's old place in the DOM once the nav reaches it's old position and remove padding from body
      if(ogNavPos > $window.scrollTop()){
        $nav.css({
          position:'relative',
          top:'inherit'
        });
        $('body').css({
          paddingTop: '0'
        });
      };
    };
  };
  return this;
};

}(jQuery));