
/*
 * GET home page.
 */

var exec = require('child_process').exec,
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
	exec('phantomjs rasterize.js '+url+' screens/screen_'+ssRole+'_'+compareId+'.png', function puts(error, stdout, stderr) { 
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

		var rnd = Math.floor(Math.random() * 1000000);

		url1 = sanitizeUrl(url1)
		url2 = sanitizeUrl(url2)


		async.waterfall([
	        //Primeros llamados a APIs
			function(firstStepCallback){
				//Todos estos llamados van en paralelo
				async.parallel({
						screen1: function(parallelCallback){
							takeScreenShot(url1,'A',rnd,parallelCallback);
							/*
							exec('phantomjs rasterize.js '+url1+'' screen1.png, function puts(error, stdout, stderr) { 
								console.log(stdout)
								parallelCallback(null,[]);
							});
							*/
		    			},
		    			screen2: function(parallelCallback){
							takeScreenShot(url2,'B',rnd,parallelCallback);
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

		    	console.log("compare screens/screen_A_"+rnd+"_.png screens/screen_B_"+rnd+"_.png screens/compare_"+rnd+".png")
		    	exec("compare screens/screen_A_"+rnd+".png screens/screen_B_"+rnd+".png screens/compare_"+rnd+".png", function puts(error, stdout, stderr) { 
		    		
		    			console.log(stdout)
		    		
					secondStepCallback(null, []);
				});

		    },
			//Render
			function(results, callback){

				// obtengo imagen y la muestro
			
				
				var compareFileName = 'screens/compare_'+rnd+'.png'
				fs.readFile(compareFileName, function (err, data) {
				  	if (err){
				  		console.log(err);
				  		res.render('index',{image:'http://www.laion.es/wp-content/uploads/2011/09/stress-registry-pc-computer-error.jpg'});
				  	}

				  	var data = "data:image/png;base64," + new Buffer(data).toString('base64');

					res.render('index',{image:data});

					callback(null, 'done');

				exec("rm screens/compare_"+rnd+".png", function puts(error, stdout, stderr) {});
				exec("screens/screen_A_"+rnd+".png", function puts(error, stdout, stderr) {});
				exec("screens/screen_B_"+rnd+".png", function puts(error, stdout, stderr) {});
				
				});

			}
		]);
	}




};