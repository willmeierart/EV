jQuery(document).ready(function () {
  jQuery.fn.isHover = function() {
    return jQuery(this).parent().find(jQuery(this).selector + ":hover").length > 0;
  }
  var _isMobile = typeof window.orientation !== 'undefined'

  function init () {
    // global vars: 
    var xMousePos = 0
    var yMousePos = 0
    var lastScrolledLeft = 0
    var lastScrolledTop = 0
    var thisCarousel = null
    var circle = 'circle'
    var square = 'square'
    var right = 'right'
    var left = 'left'
    var hoverState = circle

    // Julia's code:
    jQuery('.studio-container').click(function(e) {
      e.preventDefault()
      jQuery('#landing').css({ transform: 'translateX(100%)' }, 2000)
    })
    jQuery('.studio-container').hover(function(e) {
      e.preventDefault()
      cursor.css('background-color', '#ffd076')
    }, function() {
      // on mouseout, reset the background colour
      cursor.css('background-color', '#f36c4f')
    })
    jQuery('.overlay').hover(function(e) {
      e.preventDefault()
      jQuery('html').css('overflow-y', 'hidden')
    }, function() {
      // on mouseout, reset the background colour
      jQuery('html').css('overflow-y', 'scroll')
    })
    jQuery('#info').hover(function(e) {
      e.preventDefault()
      cursor.css('background-color', '#28636c')
    }, function() {
      cursor.css('background-color', '#f36c4f')
    })

    // info slide activity:
    jQuery("#menu-item-445 span").click(function(e) {
      e.preventDefault()
      jQuery("#info").animate({height:'100%'}, 200)
      jQuery("nav.primary.transition").css({transform:'translateY(-264px)'}, 200)
      jQuery(".burger").removeClass('active')
    })
    jQuery(".closebtn, #menu-item-491 span, #menu-item-443 span").click(function(e){
      e.preventDefault()
      jQuery("#info").animate({height:'0%'}, 200)
    })

    //add cursor element
    jQuery("body").prepend(jQuery("<div id='cursor'></div>"))
    var cursor = jQuery("#cursor").css({
      display: 'block',
      position:'absolute'
    })

    // consolidate all logic of cursor css into one function, called by many different event handlers
    function setHoverState (state, clearQueue) {
      var duration = 150

      var classList = ['hoverstate-circle', 'hoverstate-square', 'hoverstate-right', 'hoverstate-left', 'arrow-right', 'arrow-left', 'carousel']

      var states = {
        circle: {
          styles: { 'border-width': 0, width: '40px', height: '40px', 'border-radius': '50px' },
          classes: classList.filter(function(className){
            return className.indexOf(circle) !== -1
          })
        },
        square: {
          styles: { 'border-width': 0, width: '40px', height: '40px', 'border-radius': 0 },
          classes: classList.filter(function(className){
            return className.indexOf(square) !== -1
          })
        },
        left: {
          styles: { 'border-top-width': '40px', 'border-bottom-width': '40px', 'border-left-width': 0, 'border-right-width': '60px', width: 0, height: 0, 'border-radius': 0 },
          classes: classList.filter(function(className){
            return className.indexOf(left) !== -1 || className === 'carousel'
          })
        },
        right: {
          styles: { 'border-top-width': '40px', 'border-bottom-width': '40px', 'border-left-width': '60px', 'border-right-width': 0, width: 0, height: 0, 'border-radius': 0 },
          classes: classList.filter(function(className){
            return className.indexOf(right) !== -1 || className === 'carousel'
          })
        }
      }

      function animateCursor (state) {
        var theseStyles = states[state].styles
        var theseClasses = states[state].classes.join(' ')
        var filterClass = states[state].classes[0]
        if (!cursor.hasClass(filterClass)) {
          console.log(filterClass);
          var animation = clearQueue
            ? cursor.stop(true).clearQueue().animate(theseStyles, duration).delay(duration).removeClass().addClass(theseClasses)
            : cursor.animate(theseStyles, duration).delay(duration).removeClass().addClass(theseClasses)
          return animation
        }
        return
      }
      animateCursor(state)
    }

    // cursor funstuff:
    function hoverFunc1 (e) {
      e.preventDefault()
      setHoverState(square, true)
    }
    function hoverFunc2 (e) {
      e.preventDefault()
      setHoverState(circle, true)
    }
    jQuery('a').hover(hoverFunc1, hoverFunc2)
    
    jQuery(window).on("scroll", function(e){
      if(lastScrolledLeft != jQuery(document).scrollLeft()){
        xMousePos -= lastScrolledLeft
        lastScrolledLeft = jQuery(document).scrollLeft()
        xMousePos += lastScrolledLeft
      }
      if(lastScrolledTop != jQuery(document).scrollTop()){
        yMousePos -= lastScrolledTop
        lastScrolledTop = jQuery(document).scrollTop()
        yMousePos += lastScrolledTop
      }
      window.status = "x = " + xMousePos + " y = " + yMousePos
      
      cursor.css({
        top: yMousePos + 5 - cursor[0].offsetHeight / 2.0 + "px",
        left: xMousePos + 3 - cursor[0].offsetWidth / 2.0 + "px"
      })
    })
    
    function captureMousePosition(event){
      xMousePos = event.pageX
      yMousePos = event.pageY
      window.status = "x = " + xMousePos + " y = " + yMousePos
      
      cursor.css({
        top: yMousePos + 5 - cursor[0].offsetHeight / 2.0 + "px",
        left: xMousePos + 3 - cursor[0].offsetWidth / 2.0 + "px"
      })
    }

    jQuery(window).on('mousemove', function(event) {
      captureMousePosition(event)

      var interval = setInterval(function() {
        jQuery('.lay-carousel').hover(function() {
          thisCarousel = this
        })
        clearInterval(interval)
      }, 5)
      if (cursor.hasClass('carousel')) {
        if (jQuery(thisCarousel).hasClass('cursor-right')) {
          setHoverState(right, true)
        } else if (jQuery(thisCarousel).hasClass('cursor-left')) {
          setHoverState(left, true)
        }
      }
    })
                      
  
    // handle the weirdness of this theme and find whether the cursor should know that it's over a carousel element
    jQuery('*').hover(function(e) {
      if (jQuery(e.target).parents('.lay-carousel-slide').length > 0) {
        if (jQuery(e.target).isHover()) {
          cursor.addClass('carousel')
        } else {
          setHoverState(circle, true)
        }
      }
    })

    function doCoolSplashWordStuff () {
      var words = ['STUDIO'.split(''), 'SHOP'.split('')]
      words.forEach(function(set, j) {
        set.forEach(function(letter, i){
            var realLetter = letter
            if(j === 1) { realLetter = letter + '2' }
            function jQThing(str) {
              var realStr = j === 1 && str !== 'slant' ? str + '2' : str
              var selector = '#' + realLetter
              var jQselector = jQuery(selector).children('.' + realStr)
              var doesSpin = jQselector.text().indexOf('O') !== -1 ? ', spin 3s infinite linear' : ''
              var timing = j === 0 ? 4 : 3
                jQselector.css({
                  animation: str + 'switch ' + timing + 's steps(1) infinite ' + (0.2 * (i + 1)).toFixed(2) + 's ' + doesSpin
                })
            }
            jQThing('symbol')
            jQThing('slant')
          })
      })
    }
    
    if (_isMobile) { setTimeout(function () { doCoolSplashWordStuff() }, 200) }  
  }

  window.laytheme.on('newpage', function() {
    init()
  })
})

// just in case ... :

      // switch (state) {
      //   case circle :
      //     if (!cursor.hasClass('hoverstate-circle')) {
      //       console.log(circle)
      //       clearQueue
      //         ? cursor
      //           .stop().clearQueue().animate(circleStyles, duration)
      //           .delay(duration)
      //           .removeClass('arrow-right arrow-left carousel hoverstate-square hoverstate-right hoverstate-left')
      //           .addClass('hoverstate-circle')
      //         : cursor
      //           .animate(circleStyles, duration)
      //           .delay(duration)
      //           .removeClass('arrow-right arrow-left carousel hoverstate-square hoverstate-right hoverstate-left')
      //           .addClass('hoverstate-circle')
      //     }
      //     return
      //   case square :
      //     if (!cursor.hasClass('hoverstate-square')) {
      //       console.log(square)            
      //       clearQueue
      //         ? cursor
      //           .stop().clearQueue().animate(squareStyles, duration)
      //           .delay(duration)
      //           .removeClass('arrow-right arrow-left carousel hoverstate-circle hoverstate-right hoverstate-left')
      //           .addClass('hoverstate-square')
      //         : cursor
      //           .animate(circleStyles, duration)
      //           .delay(duration)
      //           .removeClass('arrow-right arrow-left carousel hoverstate-circle hoverstate-right hoverstate-left')
      //           .addClass('hoverstate-square')
      //     }
      //     return
      //   case left :
      //     if (!cursor.hasClass('hoverstate-left')) {
      //       console.log(left)            
      //       clearQueue
      //         ? cursor
      //           .stop().clearQueue().animate(leftStyles, duration)
      //           .delay(duration)
      //           .removeClass('arrow-right hoverstate-square hoverstate-right hoverstate-circle')
      //           .addClass('arrow-left carousel hoverstate-left')
      //         : cursor
      //           .animate(leftStyles, duration)
      //           .delay(duration)
      //           .removeClass('arrow-right hoverstate-square hoverstate-right hoverstate-circle')
      //           .addClass('arrow-left carousel hoverstate-left')
      //     }
      //     return
      //   case right :
      //     console.log(right)
      //     if (!cursor.hasClass('hoverstate-right')) {
      //       clearQueue
      //         ? cursor
      //           .stop().clearQueue().animate(rightStyles, duration)
      //           .delay(duration)
      //           .removeClass('arrow-left hoverstate-square hoverstate-left hoverstate-circle')
      //           .addClass('arrow-right carousel hoverstate-right')
      //         : cursor
      //           .animate(rightStyles, duration)
      //           .delay(duration)
      //           .removeClass('arrow-left hoverstate-square hoverstate-left hoverstate-circle')
      //           .addClass('arrow-right carousel hoverstate-right')
      //     }
      //     return
      //   default:
      //     if (this.hoverState !== circle) {
      //       cursor
      //         .animate(circleStyles, duration)
      //         .delay(duration)
      //         .removeClass('arrow-right arrow-left carousel')
      //     }
      //     console.log('not valid state: ', state)
      //     // keep cursor a circle
      //     return
      // }
