var clc = require('cli-color');
var request = require('request');

var urlTester = {
	linksToTest: [],
	options: {},
	baseUrl: '',
	runTests: function (options) {
		if(!options.concurrency) options.concurrency = 10; // set default concurrency
		this.baseUrl = options.baseUrl; // set baseUrl

		this.linksToTest = options.links;
		this.options = options;

		console.log(clc.green('Total Links to test: ' + this.linksToTest.length));

		this.linksToTest.forEach(this.processLink); // change this to use async
	},
	processLink: function(item) {
		var url = (!item.ignoreBase ? urlTester.baseUrl : '') + item.from;
		request(url, { followRedirect:false }, function (error, response, body) {
			if(error) {
				console.log(clc.red('There was an error [' + error + '] on: ')  + clc.yellow(url));
				return;
			}
			var gotCode = response.statusCode;
			if(!item.to) { // we are not expecting a redirect - only a status code
				if(item.code == gotCode) {
					console.log(clc.green('Successful test for ' + url + ' Expected ['+item.code+'] got ['+gotCode+']'));
				} else {
					console.log(clc.red('There was a problem with ' + url + ' Expected ['+item.code+'] got ['+gotCode+']'));
				}
			} else {
				var newLocation = response.headers.location;

				if(item.code != gotCode) {
					console.log(clc.red('There was a problem with the redirect for ' + url + ' Expected ['+item.code+'] got ['+gotCode+']'));
					return;
				}



				// remove baseUrl if needed
				if(!item.ignoreBase) newLocation = newLocation.replace(urlTester.baseUrl,'');


				if(item.to != newLocation) {
					console.log(clc.red('There was a problem with the redirect for ' + url + ' Expected [' + item.to + '] got [' + newLocation + ']'));
				} else {
					console.log(clc.green('Successful test for ' + url + ' Expected [' + item.to + '] got [' + newLocation + ']'));
				}

			}

		});

	}

};





module.exports = urlTester;