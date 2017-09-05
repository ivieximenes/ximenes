$(document).ready(function(){

	//Global variables
	var focusableElements = 'a, input, select, button, textarea';
	var modalAreas =  '.smt-modal, .smt-menu';

	$('.smt-toggler:not(#smart-header-logged)').change(function(){
		$('body').toggleClass('noscroll');
	});


	$('.smt-toggler').change(function(){
		var $toggler = $(this);
		var $togglerArea = $toggler.parent();
		var $togglerModal = $toggler.siblings('.smt-modal, .smt-menu');
		if ($toggler.is(':checked')) {
			$('body').one('click', toggleOff);
			enableFocusOnModal($togglerModal);
			lastModalFocus($togglerModal);
		}  else {
			$('body').off('click', toggleOff);
			disableFocusOnModal($togglerModal);
			$toggler.blur();
		}

		function toggleOff(event)
		{
			event.stopPropagation();
			$target = $(event.target);
			if ( !$target.closest($togglerArea[0]).length > 0 ) {
				$toggler.prop('checked', false);
				$('body').removeClass('noscroll');	
			}
		}
	});

	// Focusable elements 

	$('*[data-modal="hide"]').each(function(){
		$(this).siblings(modalAreas).find(focusableElements).attr('tabindex','-1');
	});

	function enableFocusOnModal($modal) {
		$modal.find(focusableElements).removeAttr('tabindex');
	}

	function disableFocusOnModal($modal) {
		$modal.find(focusableElements).attr('tabindex','-1');
	}

	function lastModalFocus($modal)
	{
		var $trigger = $modal.siblings('.smt-toggler');
		var $modalElements = $modal.find(focusableElements);
		$modalElements.last().blur(function(){
			setTimeout(function(){
				var $activeFocus = $(':focus');
				var $trigger = $modal.siblings('.smt-toggler');
				if (!$activeFocus.is($modalElements)) {
					$trigger.prop('checked', false);
					$('body').removeClass('noscroll');
					disableFocusOnModal($modal);
				}
			},100);
		});
	};


	(function createClassOnFocus(){
		$('*[data-focus-class]').find(focusableElements).each(function(){
			var $this = $(this);
			var $wrapper = $this.closest('*[data-focus-class]');
			$this.focus(function(){
				$wrapper.addClass('focused');
			});
			$this.blur(function(){
				$wrapper.removeClass('focused');
			});
		});
	})();


	//Sliders
	$('.smt-carousel-items').slick({
		infinite: true,
  		slidesToShow: 1,
  		slidesToScroll: 1,
  		adaptiveHeight: true,
  		dots: false,
  	    autoplay: true,
  	    autoplaySpeed: 5000
	});

	$('.smt-news-items').slick({
	  	mobileFirst:true,
  	    responsive: [
  	    {
  	    	breakpoint:0,
  	    	settings: {
  	    	infinite: true,
	  		slidesToShow: 1,
	  		slidesToScroll: 1,
	  		adaptiveHeight: true,
	  	    }
  	    },
	    {
	      breakpoint: 768,
	      settings: "unslick"
	    }]
	});


	//Modal

	$('*[data-remote-modal]').each(function(){
		var $this = $(this);
		var $modal = $this.closest('.smt-modal');
		var $trigger = $modal.siblings('.smt-toggler');
		var $targetModalTrigger = $($this.attr('data-remote-modal'));
		var $targetModal = $targetModalTrigger.siblings('.smt-modal');
		$this.click(function(){	
			
			if ($modal.length > 0) {
				$trigger.prop('checked', false);	
			}

			$targetModalTrigger.prop('checked', true);
			enableFocusOnModal($targetModal);
			$targetModal.find(focusableElements).first().focus();
			setTimeout(function()
				{
					$('body').addClass('noscroll');
				},100);
		});	
	});

	$('.smt-modal-close').each(function(){
		var $this = $(this);
		var $modal = $this.closest('.smt-modal');
		var $trigger = $modal.siblings('.smt-toggler');
		$this.click(function(){
			$trigger.prop('checked', false);	
			$('body').removeClass('noscroll');
			$(modalAreas).find('.smt-warning').removeClass('open');
			$(modalAreas).find('span.smt-message-error').hide();
			$(modalAreas).find('.smt-input:not([readonly])').val("");
		});
	});


	// HOTKEYS
	var accessMenu = $('.smt-skipnav');
	var accessItem1 = accessMenu.find('li:first-child a');
	var accessItem2 = accessMenu.find('li:nth-child(2) a');
	var accessItem3 = accessMenu.find('li:nth-child(3) a');
	var accessItem4 = accessMenu.find('li:nth-child(4) a');
	var menuCheck = $('#smart-header-menu');
	var menuSearch = $('#smart-header-search');
	var menuSearchMobile = $('#smart-header-search-mobile');

	var altContent = function(item) {
		window.location.href = item.attr('href');
	}
	var altMenu = function() {
		menuCheck.prop('checked', true);
	}
	var altMenuClose = function() {
		menuCheck.prop('checked', false);
	}
	var findSearch = function() {
		menuSearchMobile.prop('checked', true);
		menuSearch.focus();
	}

	Mousetrap.bindGlobal('alt+1', function() {
		altMenuClose();
		altContent(accessItem1);
		return false;
	});
	Mousetrap.bindGlobal('alt+2', function() {
		$("html, body").animate({ scrollTop: 0 }, 200);
		altMenu();
		return false;
	});
	Mousetrap.bindGlobal('alt+3', function() {
		altMenuClose();
		findSearch();
		return false;
	});
	Mousetrap.bindGlobal('alt+4', function() {
		altMenuClose();
		altContent(accessItem4);
		return false;
	});
	Mousetrap.bindGlobal('esc', function() {
		$(modalAreas).siblings('.smt-toggler').prop('checked', false);
		$(modalAreas).find('.smt-warning').removeClass('open');
		$(modalAreas).find('span.smt-message-error').hide();
		$(modalAreas).find('.smt-input:not([readonly])').val("");

		return false;
	});

	accessItem2.click(function() {
		$(modalAreas).siblings('.smt-toggler').prop('checked', false);
		altMenu();
	});
	accessItem3.click(function() {
		findSearch();
		return false;
	});


	// LOGIN & SIGNUP BUTTON
	var clickModal = function(trigger, radio) {
		$(trigger).click(function() {
			$(radio).prop('checked', true);
		});
	};
	var linkModal = function(modal, trigger, radio1, radio2) {
		$(modal).click(function() {
			if ($(trigger).prop('checked') == true) {
				$(radio1).prop('checked', true);
			} else {
				$(radio2).prop('checked', true);
			}
		});
	};
	clickModal('#client-signup', '#smart-signup-cliente');
	clickModal('#provider-signup', '#smart-signup-prestador');
	clickModal('#client-login', '#smart-login-cliente');
	clickModal('#provider-login', '#smart-login-prestador');
	linkModal('#modal-login', '#smart-signup-cliente', '#smart-login-cliente', '#smart-login-prestador');
	linkModal('#modal-signup', '#smart-login-cliente', '#smart-signup-cliente', '#smart-signup-prestador');

	//TODO:Esse código está dando problema na tela de cadastro. Identidicar para que ele server. 
	/*$('.smt-client-signup .smt-main-button').click(function() {
		$('#smart-signup-continue').prop('checked', true);
		$('#smart-signup').prop('checked', false)
	});*/
	
	//Exibir alerta para navegador IE9
	function get_browser() {
        var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=/\brv[ :]+(\d+)/g.exec(ua) || []; 
            return {name:'IE',version:(tem[1]||'')};
            }   
        if(M[1]==='Chrome'){
            tem=ua.match(/\bOPR|Edge\/(\d+)/)
            if(tem!=null)   {return {name:'Opera', version:tem[1]};}
            }   
        M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
        return {
          name: M[0],
          version: M[1]
        };
     }
  
	var browser = get_browser();
	if((browser.name == 'IE' || browser.name == 'MSIE') && browser.version <= 9){
		$('#smart-warning').prop('checked', true);
	} 


	// SELECT
	$('.smt-select').selectize();


	// DATA ROLE
	if ($('[data-role="username"]').length > 0) {
		$('[data-role="username"]').text($('body').attr('data-user-name')).addClass('smt-client-name');
	};


	// LOADING
	$('.smt-main-button').click(function() {
		var $this = $(this)
		$this.addClass('loading');
		setTimeout(function() {
			$this.removeClass('loading');
		}, 3567);
	});

	// FEATURES LIST
	var $wrapper = $('.smt-features-carousel');
	var $trigger = $wrapper.find('.smt-secondary-button');
	var startHeight = 0;
	var firstsItems = $wrapper.find('.smt-features-slide').slice(0,3);
	var groupHeight = $wrapper.find('.smt-features-items').height();
	var teste = setInterval(function(){
		groupHeight = $wrapper.find('.smt-features-items').height();
		firstsItems.each(function() {
		    startHeight = startHeight > $(this).height() ? startHeight : $(this).height();
		});
		$wrapper.css('max-height', startHeight);
	},100)
	$trigger.click(function(e) {
	    e.preventDefault();
	    clearInterval(teste);
	    $wrapper.toggleClass('open');
	    if ($wrapper.is('.open')) {
	        $(this).text('Menos -');
	        $wrapper.css('max-height', groupHeight);
	    } else {
	        $(this).text('Mais +');
	        $wrapper.css('max-height', startHeight);
	    }
	});


});


