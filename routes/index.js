
/*
 * GET home page.
 */

var sys = require('sys'),
	exec = require('child_process').exec,
	fs = require('fs'),
	async = require('async');

function sanitizeUrl(url){
	var sanitizeUrl = url
	if(!(sanitizeUrl.indexOf('http') === 0)){
		sanitizeUrl = 'http://' + sanitizeUrl
	}

	return sanitizeUrl
}

function takeScreenShot(url,ssRole,compareId,callback){
	exec('phantomjs rasterize.js '+url+' screens/screen_'+ssRole+'_'+compareId+'_.png', function puts(error, stdout, stderr) { 
		console.log(stdout)
		callback(null,[]);
	});
}

exports.index = function(req, res){

	var url1 = req.query.url1
	var url2 = req.query.url2


	if(typeof url1 == 'undefined' || typeof url2 == 'undefined'){

		//console.log(req)
		res.render('index',{image:''});
		
	} else {

		url1 = sanitizeUrl(url1)
		url2 = sanitizeUrl(url2)

		console.log(url1)
		console.log(url2)

		async.waterfall([
	        //Primeros llamados a APIs
			function(firstStepCallback){
				//Todos estos llamados van en paralelo
				async.parallel({
						screen1: function(parallelCallback){
							takeScreenShot(url1,'A','lalala',parallelCallback);
							/*
							exec('phantomjs rasterize.js '+url1+'' screen1.png, function puts(error, stdout, stderr) { 
								console.log(stdout)
								parallelCallback(null,[]);
							});
							*/
		    			},
		    			screen2: function(parallelCallback){
							takeScreenShot(url2,'B','lalala',parallelCallback);
							/*
							exec("phantomjs rasterize.js "+url2+" screen2.png", function puts(error, stdout, stderr) { 
								console.log(stdout)
								parallelCallback(null,[]);
							});
		    				*/
		    			}
					},
		    		function(err, results){
						firstStepCallback(null, []);
		    		}
		    	);			
			},
			//Segundos llamados a APIs
		    function(firstResults, secondStepCallback){

		    	exec("compare screens/screen_A_lalala_.png screens/screen_B_lalala_.png screens/compare.png", function puts(error, stdout, stderr) { 
		    		
		    			console.log(stdout)
		    		
					secondStepCallback(null, []);
				});

		    },
			//Render
			function(results, callback){

				// obtengo imagen y la muestro
			
				

				fs.readFile('screens/compare.png', function (err, data) {
				  	if (err) throw err;
				  
				  	var data = "data:image/png;base64," + new Buffer(data).toString('base64');

					res.render('index',{image:data});

					callback(null, 'done');

				//	exec("rm screen1.png", function puts(error, stdout, stderr) {});
				//	exec("rm screen2.png", function puts(error, stdout, stderr) {});
				//	exec("rm compare.png", function puts(error, stdout, stderr) {});
				});

			}
		]);
	}




};