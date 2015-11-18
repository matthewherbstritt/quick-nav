(function(window){

	'use strict'

	/*
	|--------------------------------------------------
	| Polyfill - forEach
	|--------------------------------------------------
	*/

	// Production steps of ECMA-262, Edition 5, 15.4.4.18
	// Reference: http://es5.github.io/#x15.4.4.18
	if (!Array.prototype.forEach) {

		Array.prototype.forEach = function(callback, thisArg) {

			var T, k;

			if (this == null) {
				throw new TypeError(' this is null or not defined');
			}

			// 1. Let O be the result of calling ToObject passing the |this| value as the argument.
			var O = Object(this);

			// 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
			// 3. Let len be ToUint32(lenValue).
			var len = O.length >>> 0;

			// 4. If IsCallable(callback) is false, throw a TypeError exception.
			// See: http://es5.github.com/#x9.11
			if (typeof callback !== "function") {
				throw new TypeError(callback + ' is not a function');
			}

			// 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
			if (arguments.length > 1) {
				T = thisArg;
			}

			// 6. Let k be 0
			k = 0;

			// 7. Repeat, while k < len
			while (k < len) {

				var kValue;

				// a. Let Pk be ToString(k).
				//   This is implicit for LHS operands of the in operator
				// b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
				//   This step can be combined with c
				// c. If kPresent is true, then
				if (k in O) {

					// i. Let kValue be the result of calling the Get internal method of O with argument Pk.
					kValue = O[k];

					// ii. Call the Call internal method of callback with T as the this value and
					// argument list containing kValue, k, and O.
					callback.call(T, kValue, k, O);
				}
				// d. Increase k by 1.
				k++;
			}
			// 8. return undefined
		};
	}

	/*
	|--------------------------------------------------
	| Polyfill - getComputedStyle
	|--------------------------------------------------
	*/

	var computed = !!window.getComputedStyle;
	
	if(!computed){
	
		window.getComputedStyle = function(el){
			
			this.el = el;
			this.getPropertyValue = function(prop){
				
				var re = /(\-([a-z]){1})/g;
				
				if(prop === 'float'){
					prop = 'styleFloat';
				}
				
				if(re.test(prop)){
					prop = prop.replace(re, function(){
						return arguments[2].toUpperCase();
					});
				}
				
				return el.currentStyle[prop] ? el.currentStyle[prop] : null;
			
			};
			
			return this;
			
		};
	
	}

	/*
	|--------------------------------------------------
	| Quick Nav Code
	|--------------------------------------------------
	*/

	var qnBtns, qnNavs, overlay, pushContent,

		docRoot 	= document.documentElement,
		errorPrefix = '[quick-nav]: ',

		CLASS = {

			contentPushed 		: 'qn-pushed',
			offCanvasHidden 	: 'qn-off-canvas--hidden',
			overlay 			: 'qn-page-overlay',
			overlayHidden  		: 'qn-page-overlay--hidden',
			navCollapse 		: 'qn-nav--collapse',
			navOffCanvasSlide 	: 'qn-off-canvas--slide',
			navOffCanvasPush 	: 'qn-off-canvas--push',
			navOpen 			: 'qn-nav--open',
			noAnimate 			: 'qn-no-animate'
			
		},

		ATTR = {
			
			qnBtn 		: 'data-qn-btn',
			qnNav 		: 'data-qn-nav',
			qnOverlay	: 'data-qn-overlay'
			
		},

		ID = {
			overlay 	: 'js-qn-overlay',
			pushContent	: 'js-qn-push-content'
		},

		classListSupport 	= ('classList' in document.documentElement)

	init()

	/*
	|--------------------------------------------------------------------------
	| Event Handlers
	|--------------------------------------------------------------------------
	*/
	
	function toggleNav(event){
		
		var targetNav 	= getTargetNav(event, ATTR.qnBtn, ATTR.qnNav),
			collapseNav = hasClass(targetNav, CLASS.navCollapse),
			slideNav 	= hasClass(targetNav, CLASS.navOffCanvasSlide),
			pushNav 	= hasClass(targetNav, CLASS.navOffCanvasPush)

		if(collapseNav){
			return toggleCollapse(targetNav)
		}

		if(slideNav || pushNav){
			return toggleOffCanvas(targetNav)
		}

	}
	
	function onResize(){

		var collapseNavs 	= getNavByClass(CLASS.navCollapse),
			offCanvasNavs 	= [].concat(getNavByClass(CLASS.navOffCanvasPush), getNavByClass(CLASS.navOffCanvasSlide)),
			mobileView 		= isMobileView()

		if(offCanvasNavs){
			offCanvasNavs.forEach(function(nav){
				addClass(nav, CLASS.offCanvasHidden)
			})
		}

		if(overlay){
			addClass(overlay, CLASS.overlayHidden)
		}

		if(collapseNavs){

			collapseNavs.forEach(function(nav){

				if(mobileView){
					nav.style.position = 'relative'
				}

			})

		}

	}

	/*
	|--------------------------------------------------------------------------
	| Helper Functions
	|--------------------------------------------------------------------------
	*/

	function bind(target, eventName, callback){

		if(isArray(target)){
			return target.forEach(function(item){
				bindEvent(item, eventName, callback)
			})
		}

		return bindEvent(target, eventName, callback)

		throwBindError(target, eventName)

	}

	function bindEvent(element, eventName, callback){

		if(!canBind(element)) throwBindError(element, eventName)

		var postIE8 = (element.addEventListener)

		if(postIE8){
			return element.addEventListener(eventName, callback, false)
		}

		return element.attachEvent('on' + eventName, callback)
	}

	function getElementByDataAttr(dataAttr, value){

		if(!dataAttr) throw new Error('[quick-nav] invalid data attribute')

		var valueStr 	= (value) ? '="' + value + '"]' : ']',
			query 		= '[' + dataAttr + valueStr,
			nodeList 	= document.querySelectorAll(query)


		return toArray(nodeList)
	}

	function getTargetNav(event, btnAttr, navAttr){

		var targetNav 		= undefined,
			clickedElement 	= event.target || event.srcElement,
			overlay 		= hasClass(clickedElement, CLASS.overlay),
			btnId 	   		= clickedElement.getAttribute(btnAttr),
			elements 		= btnId ? getElementByDataAttr(navAttr, btnId) : false

		if(overlay){

			qnNavs.forEach(function(nav){
				if(nav.getAttribute(ATTR.qnOverlay)){
					targetNav = nav
				}
			})

			if(!targetNav) throw new Error('[quick-nav] Target nav is undefined')

			return targetNav
		}

		if(!elements || !elements.length) throw new Error('[quick-nav] Target nav is undefined')

		if(elements.length > 1) throw new Error('[quick-nav] Multiple navs found. Cannot link button to more than one nav.')

		return elements[0]
	}

	function toggleCollapse(targetNav){

		if(hasClass(targetNav, CLASS.navOpen)){

			removeClass(targetNav, CLASS.navOpen)

			if(browserSupportsCssTransition()){

				setTimeout(function(){
					targetNav.style.position = 'absolute'
				}, 310)

			} else {
				targetNav.style.position = 'absolute'
			}

		} else {
			addClass(targetNav, CLASS.navOpen)
			targetNav.style.position = 'relative'
		}

	}

	function toggleOffCanvas(targetNav){

		var withOverlay = targetNav.getAttribute(ATTR.qnOverlay)

		if(overlay && withOverlay){
			toggleClass(overlay, CLASS.overlayHidden)
		}

		if(pushContent){
			toggleClass(pushContent, CLASS.contentPushed)
		}

		toggleClass(targetNav, CLASS.offCanvasHidden)
	}

	function init(){

		if(!canUseCssProp('transition') || !canUseCssProp('transform')){
			addClass(docRoot, CLASS.noAnimate)
		}

		qnBtns 		= getElementByDataAttr(ATTR.qnBtn)
		qnNavs 		= getElementByDataAttr(ATTR.qnNav)
		overlay 	= document.getElementById(ID.overlay)
		pushContent = document.getElementById(ID.pushContent)

		if(overlay){
			bind(overlay, 'click', toggleNav)
		}

		if(qnBtns.length){
			bind(qnBtns, 'click', toggleNav)
			bind(window, 'resize', onResize)
		}

	}

	function getNavByClass(className){

		var matched = []

		qnNavs.forEach(function(nav){
			if(isElement(nav) && hasClass(nav, className)){
				matched.push(nav)
			}
		})

		return matched
	}

	/*
	|--------------------------------------------------
	| Utility Functions
	|--------------------------------------------------
	*/

	function addClass(element, className){

		if(!element) return false

		if(classListSupport){
			return element.classList.add(className)
		}

		if(!hasClass(element, className)){
			element.className += (element.className ? ' ' : '') + className
		}

	}

	function browserSupportsCssTransition(){
		return (document.createElement('div').style['transition'] !== undefined)
	}

	function btnIsVisible(btn){
		return (window.getComputedStyle(btn, null).getPropertyValue('display') !== 'none')
	}

	function canUseCssProp(prop){
		return (document.createElement('div').style[prop] !== undefined)
	}

	function canBind(obj){
		return (obj && (obj.addEventListener || obj.attachEvent))
	}

	function hasClass(element, className){

		if(!element) return false

		if(classListSupport){
			return element.classList.contains(className)
		}

		return new RegExp('(^|\\s)' + className + '(\\s|$)').test(element.className)
	}

	function isArray(arg){
		return Object.prototype.toString.call(arg) === '[object Array]'
	}

	function isElement(obj){
		return(obj instanceof Element)
	}

	function isMobileView(){
		if(!qnBtns || qnBtns.length === 0) return false

		return btnIsVisible(qnBtns[0])
	}

	function preventDefault(event){

		if (event.preventDefault){
			return event.preventDefault()
		}

		event.returnValue = false
	}

	function removeClass(element, className){

		if(!element) return false

		if(classListSupport){
			return element.classList.remove(className)
		}

		if(hasClass(element, className)){
			element.className = element.className.replace(new RegExp('(^|\\s)*' + className + '(\\s|$)*', 'g'), ' ')
		}

	}

	function throwBindError(target, eventName){
		throw new Error(errorPrefix + 'Cannot bind event "' + eventName + '" to: ' + target)
	}

	function toArray(nodeList){

		try {

			return Array.prototype.slice.call(nodeList)

		} catch(error){

			var i, arr = []

			for (i = 0; i < nodeList.length; i++){
				arr.push(nodeList[i]);
			}

			return arr
		}

	}

	function toggleClass(element, className){

		if(!element) return false

		if(classListSupport){
			return element.classList.toggle(className)
		}

		(hasClass(element, className) ? removeClass : addClass)(element, className)

	}

})(window)
