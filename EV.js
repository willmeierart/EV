jQuery(document).ready(function ($) {
  // helper function to determine more complex / 'snappy' hover state
  $.fn.isHover = function() {
    return $(this).parent().find($(this).selector + ":hover").length > 0;
  }
  // only rotatable devices aka mobile have this property
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

    //add cursor element
    if ($('body').children('#cursor').length === 0){
      $("body").prepend($("<div id='cursor'></div>"))
    }
    var cursor = $("#cursor").css({ display: 'block', position:'absolute'})

    // POWERHOUSE FUNCTION:
    // consolidates all logic of cursor css into one function, called by many different event handlers
    function setHoverState (state, clearQueue) {
      // set global timing of animations here 
      var duration = 150

      // if you create new hoverstates, add a class here, at the beginning of the array, of 'hoverstate-[whatever]'
      var classList = ['hoverstate-circle', 'hoverstate-square', 'hoverstate-right', 'hoverstate-left', 'arrow-right', 'arrow-left', 'carousel']

      // and then just add their css relationships here
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
          var animation = clearQueue
            ? cursor.stop(true).clearQueue().animate(theseStyles, duration).delay(duration).removeClass().addClass(theseClasses)
            : cursor.animate(theseStyles, duration).delay(duration).removeClass().addClass(theseClasses)
          return animation
        }
        return
      }

      animateCursor(state)
    }

    function hoverFunc1 (e) {
      e.preventDefault()
      setHoverState(square, true)
    }
    function hoverFunc2 (e) {
      e.preventDefault()
      setHoverState(circle, true)
    }
    $('a').hover(hoverFunc1, hoverFunc2)
    setTimeout(function(){ $('a').hover(hoverFunc1, hoverFunc2)}, 1000)

    // 
    function checkCarouselHover (e) {
      //for throttling firing of hovercheck:
      var interval = 0
      
      // only add e in the wildcard hover function (event is different for scroll)
      if (e) {
        if ($(e.target).parents('.lay-carousel-slide').length > 0) {
          if ($(e.target).isHover()) {
            cursor.addClass('carousel')
          } else {
            setHoverState(circle, true)
          }
        }
      }
      var hoverInterval = setInterval(function() {
        $('.lay-carousel').hover(function() {
          thisCarousel = this
        })
        clearInterval(hoverInterval)
      }, interval)
      if (cursor.hasClass('carousel')) {
        if ($(thisCarousel).hasClass('cursor-right')) {
          setHoverState(right, true)
        } else if ($(thisCarousel).hasClass('cursor-left')) {
          setHoverState(left, true)
        }
      }
    }
    
    // make sure to track mouse on scroll too
    $(window).on("scroll", function(e){
      if(lastScrolledLeft != $(document).scrollLeft()){
        xMousePos -= lastScrolledLeft
        lastScrolledLeft = $(document).scrollLeft()
        xMousePos += lastScrolledLeft
      }
      if(lastScrolledTop != $(document).scrollTop()){
        yMousePos -= lastScrolledTop
        lastScrolledTop = $(document).scrollTop()
        yMousePos += lastScrolledTop
      }
      window.status = "x = " + xMousePos + " y = " + yMousePos
      
      cursor.css({
        top: yMousePos + 5 - cursor[0].offsetHeight / 2.0 + "px",
        left: xMousePos + 3 - cursor[0].offsetWidth / 2.0 + "px"
      })

      checkCarouselHover()
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

    $(window).on('mousemove', function(event) {
      captureMousePosition(event)
      checkCarouselHover()
    })
                      
  
    // handle the weirdness of this theme and find whether the cursor should know that it's over a carousel element
    $('*').hover(function(e) {
      checkCarouselHover(e)
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
              var jQselector = $(selector).children('.' + realStr)
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

        // Julia's code:
    $('.studio-container').click(function(e) {
      e.preventDefault()
      $('#landing').css({ transform: 'translateX(100%)' }, 2000)
    })
    $('.studio-container').hover(function(e) {
      e.preventDefault()
      cursor.css('background-color', '#ffd076')
    }, function() {
      // on mouseout, reset the background colour
      cursor.css('background-color', '#f36c4f')
    })
    $('.overlay').hover(function(e) {
      e.preventDefault()
      $('html').css('overflow-y', 'hidden')
    }, function() {
      // on mouseout, reset the background colour
      $('html').css('overflow-y', 'scroll')
    })
    $('#info').hover(function(e) {
      e.preventDefault()
      cursor.css('background-color', '#28636c')
    }, function() {
      cursor.css('background-color', '#f36c4f')
    })

    // info slide activity:
    $("#menu-item-445 span").click(function(e) {
      e.preventDefault()
      $("#info").animate({height:'100%'}, 200)
      $("nav.primary.transition").css({transform:'translateY(-264px)'}, 200)
      $(".burger").removeClass('active')
    })
    $(".closebtn, #menu-item-491 span, #menu-item-443 span").click(function(e){
      e.preventDefault()
      $("#info").animate({height:'0%'}, 200)
    })
  }

  window.laytheme.on('newpage', function() { init() })
  window.laytheme.on('newpageshown', function() { init() })
})
