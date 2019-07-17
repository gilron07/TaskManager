// check user logged in middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
      return next();
  
    console.log("No premission");
    res.redirect('/login');
  }
  // check if user is admin middleware
  function isAdmin(req, res, next) {
    if (req.user && req.user.is_admin)
      return next();
    res.redirect('/login');
  }

  module.exports = {isLoggedIn , isAdmin};