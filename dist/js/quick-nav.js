(function(){

	'use strict';

	var CLASS = {
		
			mobileNavHidden 	: 'qn-nav--mobile--hidden',
			overlayHidden  		: 'qn-page-overlay--hidden'
			
		},

		ID = {
			
			mobileNav		: 'js-qn-nav--mobile',
			mobileNavBtn 	: 'js-qn-menu-btn',
			overlay 		: 'js-qn-page-overlay'
			
		},

		classListSupport 	= ('classList' in document.documentElement),
		mobileNav 			= document.getElementById(ID.mobileNav),
		mobileNavBtn 		= document.getElementById(ID.mobileNavBtn),
		overlay 			= document.getElementById(ID.overlay);

	bind(mobileNavBtn, 'click', openNav);
	bind(overlay, 'click', closeNav);
	bind(window, 'resize', closeNav);

	/*
	|--------------------------------------------------------------------------
	| Event Handlers
	|--------------------------------------------------------------------------
	*/

	function closeNav(event){
		console.log('closeNav');
		addClass(mobileNav, CLASS.mobileNavHidden);
		addClass(overlay, CLASS.overlayHidden);
	}

	function openNav(event){
		console.log('openNav')
		preventDefault(event);
		toggleClass(mobileNav, CLASS.mobileNavHidden);
		toggleClass(overlay, CLASS.overlayHidden);
	}

	/*
	|--------------------------------------------------------------------------
	| Helper Functions
	|--------------------------------------------------------------------------
	*/

	function hasClass(element, className){

		if(classListSupport){
			return element.classList.contains(className);
		}

		return new RegExp('(^|\\s)' + className + '(\\s|$)').test(element.className);
	}

	function addClass(element, className){

		if(classListSupport){
			return element.classList.add(className);
		}

		if(!hasClass(element, className)){
			element.className += (element.className ? ' ' : '') + className;
		}

	}

	function removeClass(element, className){

		if(classListSupport){
			return element.classList.remove(className);
		}

		if(hasClass(element, className)){
			element.className = element.className.replace(new RegExp('(^|\\s)*' + className + '(\\s|$)*', 'g'), '');
		}

	}

	function toggleClass(element, className){

		if(classListSupport){
			return element.classList.toggle(className);
		}

		(hasClass(element, className) ? removeClass : addClass)(element, className);
	}

	function preventDefault(event){

		if (event.preventDefault){
			return event.preventDefault();
		}

		event.returnValue = false;
	}

	function bind(element, eventName, callback){

		var postIE8 = (element.addEventListener);

		if (postIE8){
			return element.addEventListener(eventName, callback, false);
		}

		return element.attachEvent('on' + eventName, callback);
	}

})();
