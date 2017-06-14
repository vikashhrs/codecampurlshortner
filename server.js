var express = require('express');
var mongoose = require('mongoose');
var Url = require('./models/url');
var request = require('request');
var app = express();


mongoose.connect('mongodb://ikashhrs:12345@ds125262.mlab.com:25262/urlshortner');


var PORT = process.env.PORT || 3000;
var shortner = "123456987"


app.get('/',function(req,res){
	 var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	 console.log(process.env.APP_URL);
	 res.status(200).send({url : fullUrl});
});

app.get('/new/:url*',function(req,res){
	var url = req.url.slice(5);
	console.log(req.url)
	console.log(url)
	console.log(validateURL(url))
	console.log(process.env.APP_URL)
	console.log(req.params.url);
	console.log(process.env.APP_URL);
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	var rootUrl = fullUrl.substring(0,fullUrl.indexOf("new"));
	
	if(validateURL(url)){
		Url.findOne({original_url : url},function(err,foundUrl){
		if(err)
			throw error
		if(foundUrl){
			res.status(200).send({original_url : foundUrl.original_url,short_url:foundUrl.short_url});
		}
		if(!foundUrl){
			Url.find(function(err,urlsFound){
				var flag = true;
				if(err){
					console.log("ddfdfdf" + url)
					res.status(500).send({error:err});
				}
				if(urlsFound){
					console.log(url + "sdsdsdsd")
					var urlList = urlsFound.map((eachurl) => {
		       			 return eachurl.short_url;
				});

				var newLink;
		      
		      	do {
			        // Generates random four digit number for link
			        var num = Math.floor(100000 + Math.random() * 900000);
			        newLink = rootUrl + num.toString().substring(0, 4);
					} while (urlList.indexOf(newLink) != -1);

					var urlpiece = new Url({original_url : url,short_url : newLink});
					urlpiece.save(function(err){
						if(err){
							res.status(500).send({reason : err});
						}else{
							res.status(200).send({original_url : url,short_url:newLink})
						}
						
					})
				}
				if(!urlsFound){
					console.log(url + " fffefefe")
					var num = Math.floor(100000 + Math.random() * 900000);
				    var newLink = rootUrl + num.toString().substring(0, 4);
				    var urlpiece = new Url({original_url : url,short_url : newLink});
					urlpiece.save(function(err){
						if(err){
							res.status(500).send({reason : err});
						}else{
							res.status(200).send({originalUrl : url,short_url:newLink})
						}
					})
				}

			})
		}
	})

	}else{
		res.status(404).send({message : "Invalid url"});
	}

});

app.get('/:url',function(req,res){
	console.log(req.params.url)
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	console.log(fullUrl);
	
	Url.findOne({short_url : fullUrl},function(err,foundUrl){
		if(err)
			throw err;
		if(foundUrl){
			console.log(foundUrl.original_url);
			res.redirect(foundUrl.original_url);
		}
		if(!foundUrl){
			res.status(204).send({reason : "No such url found"});
		}
	})
});

function validateURL(url) {
    // Checks to see if it is an actual url
    // Regex from https://gist.github.com/dperini/729294
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i; 
    return regex.test(url);
}
	
app.listen(PORT,function(){
	console.log("Server running at "+PORT)
})

