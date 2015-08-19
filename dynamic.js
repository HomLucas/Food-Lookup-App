// module to handle the dynamic Web pages
var http = require("http");
var request = require("request");
var	ann = require("./annotater");
ann.openDB();


function dynamic(response, urlObj) {

    response.writeHead(200, {
        "Content-Type": "application/JSON"
    });
    console.log(urlObj.pathname); 
    var parts = urlObj.pathname.split("/");
    if (parts[1] == "dyn") {
    	var requestString = "stuff";
        if (parts[2] == "getKeywords") {
            requestString = "http://food2fork.com/api/search?key=75901d2c2583e5098c1f42f4fb6e67b2&q=" + urlObj.query.split("=")[1];
        } else if (parts[2] == "showRecipe") {
            requestString = "http://food2fork.com/api/get?key=75901d2c2583e5098c1f42f4fb6e67b2&rId=" + parts[3];
        }
  	//	console.log(parts);
        request(requestString, function(error, res, body) {
            if (!error && response.statusCode == 200) {
                console.log("f2f says 200");
				if(parts[2] == "showRecipe"){
    				anotater = new ann.Annotater(body);
    				anotater.annotate(function(responseJSON) {
    				   
                     response.write(responseJSON);
                    response.end();
    				});
                }
                else{
                response.write(body);
                response.end();
                }

            } else {
                console.log("f2f says error", error);
            }
           // response.end();

        });
		
		//anotater = new ann.Annotater(recipeJSON);
	//anotater.annotate(function(newRecipeJSON) {
	//console.log("testing");
	//});
	
	
    }
	


	

}
// make this visible when the module is required
exports.dynamic = dynamic;