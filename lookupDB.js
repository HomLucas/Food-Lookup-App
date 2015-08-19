var fs = require("fs");  // use file system                                     
var sqlite3 = require("sqlite3").verbose();  // use sqlite    
var prompt = require("prompt"); //use prompt                  

// global variable will contain database                                        
var db=null;

function openDB() {
    var dbFile = "fnw.db";
    // check filesystem to make sure database exists                            
    var exists = fs.existsSync(dbFile);

    if (!exists) {
        console.log("Missing database "+dbFile);
    } else {
        // construct Javascript database object to represent the                
        // database in our program. db is a global variable                     
        db = new sqlite3.Database(dbFile); // open it if not already there      
    }
	getFood();
}

openDB(); // open the database

prompt.start(); // prepare for keyboard input                                   

function getFood() {
    // issues the prompt and specifies the callback function                    
    // that is called when the user finally responds                            
    prompt.get('food',
               // callback function                                             
               function(err, result) {
                   lookup(result.food);
               } // end callback function                                       
              ); // end prompt.get                                              
}      

function lookup(input){	

	db.get("SELECT * FROM WaterUsage WHERE ingredient= '" + input + "'", function(err,row){
    if(row != undefined){console.log(row);}
    else{console.log("ingredient not found");}
	});
}
