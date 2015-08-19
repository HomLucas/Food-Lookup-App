// BUTTON FUNCTION
var savedPage;



function ajaxCall(id) {
     clr();
	
    // get the input 
    console.log("Here" + id);
    var keywords = document.getElementById("keywords").value;
  var keywordsQuery ;
    // construct the url we want to send
    // url has a pathname (/dyn/getKeywords) and a
    // query part (?keywords=..., where ... are the keywords)
    if (id == -1) {
         keywordsQuery = "/dyn/getKeywords?keywords=" + keywords;
    } else {
         keywordsQuery = "/dyn/showRecipe/" + id;
    }

    // make an object to use for communication
    var xmlhttp = new XMLHttpRequest();

    // set up callback function
    // trick to pass data when callback will be called 
    // with no arguments: have one function call another. 
    xmlhttp.onreadystatechange = function() {

        // check to see if http exchange was successful
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            // if so, call the real callback function
            // xmlhttp.response is the body of the response
            // we're hoping it will be the JSON we want
            useAJAXdata(xmlhttp.response, id);
            console.log("here");
            console.log(savedPage);

        }
    }

    // tell the object the url
    xmlhttp.open("GET", keywordsQuery, true); // true = asynch

    // actually send the http request
    xmlhttp.send();
}


// Adds stuff to some element of the DOM
function addToDOM(someHTML) {
    element = document.getElementsByClassName("container")[0];
    var div = document.createElement('div');
    div.innerHTML = someHTML;
    element.appendChild(div);
}

function clr(){

   var myNode = document.getElementsByClassName("container")[0];
while (myNode.firstChild) {
    myNode.removeChild(myNode.firstChild);
}
}

function redraw(){
    clr();
    console.log("heere");
    console.log(savedPage);
    console.log("redrawing");
    document.getElementsByClassName("container")[0].innerHTML = savedPage;
    console.log("end redraw");
            document.getElementById("mainbody").background = "http://images8.alphacoders.com/404/404961.jpg"
        
}

// CALLBACK FUNCTION
function useAJAXdata(responseJSON, id) {
    clr();
    var total=""; 
    f2fObj = JSON.parse(responseJSON);
    console.log(JSON.stringify(f2fObj, null, "   "));
    if (id == -1) {

        total +='<h1 class="removable"><code>Here are possible recipes!</code></h1>';
        total +='<ul class = "removable">';
        for (i = 0; i < f2fObj.count; i++) {
             total += '<li class = "text" onClick = \"ajaxCall(\''+f2fObj.recipes[i].recipe_id+'\')\"><code>'+ f2fObj.recipes[i].title +'</code></li>';               
             
        }
        total += "</ul> ";
        //savedPage = document.getElementsByClassName("container")[0].innerHTML;
        savedPage = total;
        console.log("saved to page");
    } else {
        document.getElementById("mainbody").background = f2fObj.recipe.image_url;
        total +='<button onclick="redraw()">Go Back</button>';
        total +='<h1 class"removable"><code>Here is the recipe for ' + f2fObj.recipe.title + "</code></h1>";
        total +='<div class= "container-fluid">';
        total +='<div class="row">';
        total +='<div class="col-sm-4 col-sm-offset-1"';
        total +='<ul class = "removable"> <p><code>INGREDIENT</code></p>';
        for (i = 0; i < f2fObj.recipe.ingredients.length; i++) {
            total += '<li class="removable"><code>' + f2fObj.recipe.ingredients[i].split("~~~")[0] + "</code></li>";
        }               
        total += "</ul>";
        total +='</div>';
        total +='<div class="col-sm-4 col-sm-offset-1">';
        total +='<ul class = "removable"><p><code> WATER USAGE</code></p>';
        for (i = 0; i < f2fObj.recipe.ingredients.length; i++) {
            var water = "";
            if(f2fObj.recipe.ingredients[i].split("~~~")[1] != undefined){
                water = f2fObj.recipe.ingredients[i].split("~~~")[1];
            }
            total += '<li class="removable"><code>' + water + "</code></li>";
        }               
        total += "</ul>";
        total +='</div>';
        total +='</div>';
        total +='</div>';

    }
        addToDOM(total);
}