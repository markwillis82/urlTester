var urlTester = require('../');

var options = {
	baseUrl: 'http://ycombinator.com',
	links: [
		{ from: '/newsguidelines.html', code: 200 },
		{ from: '/test', code: 404 }
	]
};


urlTester.runTests(options);