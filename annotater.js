/**********************************
Module to use fnw database to look up ingredients in a 
recipe, represented in JSON in f2f's format. 

A line containing an ingredient found in the database 
will get a extended by adding "~~~" and then the water usage number
for that ingredient, so that:

1 pound Thin Spaghetti

becomes

1 pound Thin Spaghetti~~~2217

Usage:

ann = require("./annotater");
ann.openDB();

anotater = new ann.Annotater(recipeJSON);
anotater.annotate(function(newRecipeJSON) {
// need code here to do display the annotated recipe
});

Notice the use of the callback function to return the result of the
annotation. 

***********************************/

var fs = require("fs");  // use file system
var sqlite3 = require("sqlite3").verbose();  // use sqlite

// global variable will contain database
var db=null;


function openDB() {
    var dbFile = "fnw.db";
    var exists = fs.existsSync(dbFile);  

    if (!exists) {
	console.log("Missing database "+dbFile);
    } else {
	db = new sqlite3.Database(dbFile); // open it if not already there
    }
}


// exported object that is used to annotate a recipe
// make one of these for each recipe to be annotated
function Annotater (recipeJSON) {

    // code run when object is created
    // private objects; one copy for each instance of the object
    var recipeObj = JSON.parse(recipeJSON); // save recipe object to annotate
    // count of current lookups
    var count = 1; // we'll exit when this is zero

    // public method to do annotation
    // will lookup every ingredient
    // callback function is defined by dynamic server
    // we'll call it when we're done with annotation
    this.annotate = function (callback) {
	var ingredients = recipeObj.recipe.ingredients;
	for (i=0; i<ingredients.length; i++) {
	    ingLine = ingredients[i];
	    ings = ingLine.split(" ");
	    // lookup all inidvidual words
	    for (j=0; j<ings.length; j++) {
		lookup(ings[j],i,callback);
	    }
	    // lookup all pairs of words
	    for (j=0; j<ings.length-1; j++) {
		ing = ings[j]+" "+ings[j+1];
		lookup(ing,i,callback);
	    }
	    // lookup all triples of words
	    for (j=0; j<ings.length-2; j++) {
		ing = ings[j]+" "+ings[j+1]+" "+ings[j+2];
		lookup(ing,i,callback);
	    }
	}
	countDown(callback); // allow exit if all lookups are done
}


    // private method that looks up an ingredient
    // by making and SQL request 
    // key is ingredient to look up
    // i is line of recipe we are working on
    // callback is our callback function given to us by dynamic server
    function lookup (key,i,callback) {
	count++; // one more lookup running
	key = cleanup(key);
	// the database call!
	db.get('SELECT * FROM WaterUsage WHERE ingredient = "'+key+'"',
	   // callback function for SQL SELECT
	   function(err, row) {
	       if (row != undefined) {
		   // we found something!  Annotate the ingredient
		   var ingredients = recipeObj.recipe.ingredients;
		   var ingLine = ingredients[i];
		   // check for earlier annotation
		   if (ingLine.indexOf("~~~") != -1) {
		       // earlier annotation
		       // if this is a two-word key, remove annotation 
		       // that was already given so we can replace it 
		       if (key.split(" ").length == 2) {
			   ingLine = ingLine.split("~~~")[0];
		       } 
		   }
		   // do annotation only if no earlier one
		   if (ingLine.indexOf("~~~") == -1) {
		       ingLine = ingLine + "~~~" + row.waterAmount;
		       ingredients[i] = ingLine; // put back in object
		   }
	       } 
	       countDown(callback); // one more callback is done
	   }); // end db.get
    } // end function lookup


    // private function to clean up keys that might have extra chars,
    // upper case, etc, that would make them fail the lookup
    function cleanup(key) {
	// regular expression to get rid of all punctuation but %
	key = key.replace(/[\.,-\/#!$\^&\*;:{}=\_`~()]/g,"");
	key = key.toLowerCase(); // get rid of caps
	return key;
    }

    // privte method that ends an SQL SELECT callback
    // callback is callback function given to us by dynamic server
    function countDown(callback) {
	count--; // another lookup done
	// when all the lookups are done, count will be zero
	if (count == 0) {
	    // finalize and return!
	    outputJSON = JSON.stringify(recipeObj);
	    // call this callback function we've been passing around
	    // that was originally given to us by the dynamic server
	    callback(outputJSON);
	} // end if
    }// end countDown

} // end of Annotater object


// exported function to close database
function closeDB() {
	db.close();
}

exports.Annotater = Annotater;
exports.openDB = openDB;
exports.closeDB = closeDB;

