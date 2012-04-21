/*
 * home page.
 */
// handler for homepage
exports.home = function(req, res) {
	// if user is not logged in, ask them to login
	if (typeof req.session.username == 'undefined') {
		res.render('home', { title: 'Ninja Store'});
	}
	// if user is logged in already, take them straight to the items list
	else {
		res.redirect('/chat');
	}
};

// handler for form submitted from homepage
exports.home_post_handler = function(req, res) {
	// if the username is not submitted
	if (req.body.username) { 
		// store the username as a session variable
		req.session.username = req.body.username;
    res.redirect('/chat');
  } 
  else {
    req.flash('error', 'Error: name required');
		// redirect the user to homepage
    res.redirect('/');
  }
};

/*
 * Chat page.
 */
// handler for Chat page
exports.chat = function(req, res) {
	if (typeof req.session.username == 'undefined') {
		// if user is not logged in, redirect them to homepage
		res.redirect('/');
	}
	else {
		// if user is logged in already, take them straight to the items list
		res.render('chat', { title: 'Ubber Chat room', username : req.session.username });
	}
};


/*
 * Logout page.
 */
// handler for Logout page.
exports.logout = function(req, res) {
  // delete the session variable
  delete req.session.username;
  // redirect user to homepage
  res.redirect('/');
};