var menuBtn 	= '#js-qn-menu-btn',
	overlay 	= '#js-qn-page-overlay',
	mobileNav 	= '#js-qn-nav--mobile';

module.exports = {

  'Nav-left with overlay' : function(browser){

  	browser
  		.url('http://localhost:3000/nav-left-with-overlay.html')
  		.waitForElementVisible('body', 1000)
  		.resizeWindow(480, 480)

  		.assert.visible(menuBtn)
  		.assert.cssProperty(mobileNav,'left', '-208px')

  		.click(menuBtn)

  		.assert.visible(overlay)
  		.pause(250)
  		.assert.cssProperty(mobileNav,'left', '0px')

  		.click(overlay)

  		.assert.hidden(overlay)
  		.pause(250)
  		.assert.cssProperty(mobileNav,'left', '-208px')
  		
  		.end();
  		
  }
  
};
