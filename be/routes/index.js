const router = require('express').Router();

// Mount all route modules
router.use('/home', require('./home'));
router.use('/search', require('./search'));
router.use('/', require('./type'));       // /list-type, /type/:slug
router.use('/', require('./season'));     // /list-season, /season/:slug
router.use('/', require('./genre'));      // /list-genre, /genre/:slug
router.use('/bd', require('./bd'));
router.use('/movie', require('./movie'));
router.use('/schedule', require('./schedule'));
router.use('/watch', require('./watch'));
router.use('/ongoing', require('./ongoing'));
router.use('/popular', require('./popular'));

module.exports = router;
