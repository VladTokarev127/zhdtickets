$(function() {

	let lastScroll = 0;
	const defaultOffset = 25;
	const header = document.querySelector('.header');
	
	const scrollPosition = () => window.pageYOffset || document.documentElement.scrollTop;
	const containHide = () => header.classList.contains('hide');
	
	window.addEventListener('scroll', () => {
		if(scrollPosition() > lastScroll && !containHide() && scrollPosition() > defaultOffset) {
			header.classList.add('hide');
		}
		else if(scrollPosition() < lastScroll && containHide()){
			header.classList.remove('hide');
		}
		lastScroll = scrollPosition();
	})

	$('[data-accordion-item]').each(function() {
		if($(this).is('.is-open')) {
			$(this).find('[data-accordion-target]').slideDown(300);
		}
	})

	$('[data-accordion-trigger]').click(function(e) {
		e.preventDefault();
		let parent = $(this).parents('[data-accordion-item]');
		let target = parent.find('[data-accordion-target]');
		parent.toggleClass('is-open');
		target.slideToggle(300);
	})

});
