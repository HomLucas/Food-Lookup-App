/*****************************

Builds database from food.n.water.txt

******************************/

var fs = require("fs");  // use file system
var sqlite3 = require("sqlite3").verbose();  // use sqlite

var dbFile = "fnw.db";
// check to see if database exists
var exists = fs.existsSync(dbFile); 
// make the node.js object AND open the database
var db = new sqlite3.Database(dbFile); 


var inputFile = "foodWaterUsage.txt";
data = fs.readFileSync(inputFile);  // reads whole file
lines = data.toString().split("\n");  // divide into list of lines
console.log("read "+lines.length+" lines");

// set up format of database first time we use it
db.serialize( function() {
    if (!exists) {
      db.run("CREATE TABLE WaterUsage (ingredient TEXT UNIQUE NOT NULL PRIMARY KEY, waterAmount INTEGER)");
   }

    SQLstr = "INSERT OR REPLACE INTO WaterUsage (ingredient, waterAmount) VALUES";
    for (i = 0; i<lines.length-1; i++) {
	// split on double quotes
	fields = lines[i].split('"');
	// water amount
	wA = fields[2];
	// get rid of commas
	wA = wA.replace(",", "");
	// ingredients string
	ingStr = fields[1]; 
	// make a list by splitting on commas
	ingList = ingStr.split(","); 
	// use j in this loop so that i still controls outer look
	for (j=0; j<ingList.length; j++) {
	    // make the ("ing",wA) part of SQL command
	    valuesStr = '("'+ingList[j]+'",'+wA+')';
	    console.log(SQLstr+valuesStr);
	    // run SQL command
	    db.run(SQLstr+valuesStr);
	    } // end for j
    } // end for i

});  // close serialize

// have to close database before anything shows up in fnw.db
db.close();

