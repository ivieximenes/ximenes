(function ($) {

	$.fn.slideShow = function(timeOut) {
		var $elem = this;
		this.children(':gt(0)').hide();
		var count = 0;
		var total = this.children().length-1
		setInterval(function() {
			count = count>=total ? 0 : count+1;
			console.log(count,total)

			$('#slide').css({
				'background': 'url(images/gradientes/'+count+'.jpg) repeat-x'
			});
			$elem.children().eq(0).fadeOut(600).next().fadeIn(400).end().appendTo($elem);
		}, timeOut || 7000);
	};

	$('#slider-home').slideShow();


	var allPanels = $('.accordion > dd').hide();

	$('.accordion > dt > a').click(function () {
		$this = $(this);
		$target = $this.parent().next();

		if (!$target.hasClass('active')) {
			allPanels.removeClass('active').slideUp();
			$target.addClass('active').slideDown();
		}

		return false;
	});

	$('.telefone-mask').mask("(99) 9999-9999?9").ready(function (event) {
		var target, phone, element;
		target = (event.currentTarget) ? event.currentTarget : event.srcElement;
		if (!target) return;
		phone = target.value.replace(/\D/g, '');
		element = $(target);
		element.unmask();
		if (phone.length < 11) {
			element.mask("(99) 9999-9999?9");
		} else {
			element.mask("(99) 99999-9999");
		}
	});
	$('.cpf-mask').mask("999.999.999-99");
	$('.cnpj-mask').mask("99.999.999/9999-99");
	$('.dataNascimento').mask("99/99/9999");
})(jQuery);
