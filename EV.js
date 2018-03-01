jQuery(document).ready(function () {
  // determine whether on play page
  function init () {
    var _isMobile = typeof window.orientation !== 'undefined'
    
    function doCoolSplashWordStuff () {
      var words = [['S', 'T', 'U', 'D', 'I', 'O'], ['S', 'H', 'O', 'P']]
      words.forEach(function(set, j) {
        set.forEach(function(letter, i){
            var realLetter = letter
            
            if(j === 1) { 
              realLetter = letter + '2'
              /*if(words[0].indexOf(letter) !== -1) {
                realLetter = letter + '2'
              } else  {
                realLetter = letter
              }*/
            }
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
  

  
  
    function getPath(){
      var cursorWinLocSplit = window.location.pathname.split('/')
      var cursorWinLoc = cursorWinLocSplit[cursorWinLocSplit.length - 1]
      // var cursorWinLocColor = cursorWinLoc !== 'play' ? '#17242c' : 'rgba(0,0,0,0)'
      console.log(cursorWinLoc)
      return cursorWinLoc === 'play'
    }
    
      
    //add cursor element
    jQuery("body").prepend(jQuery("<div id='cursor'></div>"))
    var mobileDisplayProp = _isMobile ? 'none' : 'block'
    console.log(_isMobile ? 'none!important' : 'block')
    var cursor = jQuery("#cursor").css({
      display: mobileDisplayProp,
      position:'absolute'
    })
    
    // theme loads content in dynamically but not immediately
    // so attach links to header content but wait one second and then attach handler to rest of link tags
    jQuery('a').hover(hoverFunc1, hoverFunc2)
    setTimeout(function(){ jQuery('a').hover(hoverFunc1, hoverFunc2)},1000)
    
    
    // global vars: 
    var xMousePos = 0
    var yMousePos = 0
    var lastScrolledLeft = 0
    var lastScrolledTop = 0
    var thisCarousel = null

    // var _isPlayPage = getPath()
    var _isPlayPage = false
    console.log(_isMobile)
    
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
    
    // since page loads are synthetic, set timeout on link click to re-check page whether it's 'play' or not:
    jQuery('._MENU2').click(function(){ setTimeout(function() { _isPlayPage = getPath() }, 500) })


    // cursor funstuff:
    function hoverFunc1 (e) {
      e.preventDefault()
      jQuery('#cursor').stop().clearQueue().animate({'border-radius':'0px'},150)
    }

    function hoverFunc2 (e) {
      e.preventDefault()
      jQuery('#cursor').stop().clearQueue().animate({'border-radius':'100px'},150)
    }
      
    

      
    jQuery(window).on("scroll", function(e){
      
      // magicHover(e, true)
      // hoverShape(e, true)
      
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
    
    jQuery.fn.isHover = function() {
      return jQuery(this).parent().find(jQuery(this).selector + ":hover").length > 0;
    }


    jQuery(window).on('mousemove', function(event) {
      console.log('hovershape')
      captureMousePosition(event)

      var interval = setInterval(function() {
        jQuery('.lay-carousel').hover(function() {
          thisCarousel = this
        })
        clearInterval(interval)
      }, 20)

      if (jQuery(thisCarousel).hasClass('cursor-right')) {
        jQuery('#cursor').removeClass('arrow-left')
        if (!jQuery('#cursor').hasClass('arrow-right') && jQuery('#cursor').hasClass('carousel')) {
          jQuery('#cursor').addClass('arrow-right')

          jQuery('#cursor').animate({ 'border-top-width': _isPlayPage ? 0 : '40px', 'border-bottom-width': _isPlayPage ? 0 : '40px', 'border-left-width': _isPlayPage ? 0 : '60px', 'border-right-width': 0, width: 0, height: 0, 'border-radius': 0 }, 150)
              // 'border-right-color': cursorWinLocColor
        } else {
          jQuery('#cursor').removeClass('arrow-right')
          if (!jQuery('#cursor').hasClass('arrow-left') && jQuery('#cursor').hasClass('carousel')) {
            jQuery('#cursor').addClass('arrow-left')
            jQuery('#cursor').animate({ 'border-top-width': _isPlayPage ? 0 : '40px', 'border-bottom-width': _isPlayPage ? 0 : '40px', 'border-left-width': _isPlayPage ? 0 : '60px', 'border-right-width': 0, width: 0, height: 0, 'border-radius': 0 }, 150)
                // 'border-right-color': cursorWinLocColor
          }
        }
      }
    })
                      
  
    // handle the weirdness of this theme and find whether the cursor should know that it's over a carousel element
    jQuery('*').hover(function(e) {
      if (jQuery(e.target).parents('.lay-carousel-slide').length > 0) {
        if (jQuery(e.target).isHover()) {
          e.stopPropagation()
          e.preventDefault()
          e.preventDefault()
          e.stopPropagation()
          jQuery('#cursor').addClass('carousel')
        } else {
          e.preventDefault()
          e.stopPropagation()
          jQuery('#cursor')
            // .stop()
            // .clearQueue()
            .animate({ 'border-width': 0, width: '40px', height: '40px', 'border-radius': '40px' }, 150) // << this is where your problem is, most likely
            .delay(150)
            .removeClass('arrow-right arrow-left carousel')
        }
      }
    })
      


    if (_isMobile) {
      setTimeout(function () { doCoolSplashWordStuff() }, 200)
    }

  
  }
  window.laytheme.on('newpage', function() {
    init()
  })
})
