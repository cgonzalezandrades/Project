// initialize firebase
var config = {
    apiKey: "AIzaSyDPANM_Lp4yJ2jWqr-MPK4pAT8HU5VQizA",
    authDomain: "testproject-ffd08.firebaseapp.com",
    databaseURL: "https://testproject-ffd08.firebaseio.com",
    storageBucket: "testproject-ffd08.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();
var geocoder;
var map;
var mapDisplayed = false;

//display map and center on Orlando

$("#get-product-text").on('click', function () {

    if (!mapDisplayed) {
        document.getElementById('map').style.display = "block";
        
//    console.log('inside');
//        document.getElementsByClassName('new-map').style.display = "block";

        initMap();
        mapDisplayed = true;

    } else {
        return;
    }

});

$(".ingredient-button").on('click', function () {
    
    $('.add-product-col').hide();
    $('.get-product-col').hide();
    
    document.getElementsByClassName('new-map').style.display = "block";
    
     initMap();
    
    
});


function initMap() {

    geocoder = new google.maps.Geocoder();
    var latlng = new google.maps.LatLng(28.495, -81.400);
    var mapOptions = {
        zoom: 10,
        center: latlng,
    };


    //
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    database.ref().on("child_added", function (snapshot) {
        var contentString = snapshot.val().ingredient;
        var itemLocation = JSON.parse(snapshot.val().location);
        var locationForDiv = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + itemLocation.lat + "," + itemLocation.lng + "&key=AIzaSyAdC7G5MC9G8uxPUYabGBD93xL-lyzRu54"


        $.ajax({
                url: locationForDiv,
                method: 'GET'
            })
            .done(function (response) {
                var name = snapshot.val().name;
                console.log(itemLocation);
                console.log(name);
                console.log(contentString);
                var itemLoc = response.results[0].address_components[2].short_name;
                console.log(itemLoc);
                var itemDiv = $('<div/>');
                itemDiv.addClass('userInfo');
                itemDiv.append("<span>" + name + "</span>");
                itemDiv.append("<span>" + itemLoc + "</span>");
                itemDiv.append("<span>" + contentString + "</span>");
                $('#userInfo').append(itemDiv);
            });

        var infowindow = new google.maps.InfoWindow({
            content: contentString,
        });
        //place marker on the map
        var marker = new google.maps.Marker({
            position: itemLocation,
            map: map,
            title: 'Ingredients'
        });
        //open info window when clicking on the marker
        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
    });
}

//function to record fields when the button is clicked
function codeAddress() {

//    var name = document.getElementById('name').value;
    var ingredient = document.getElementById('ingredient').value;
//    var email = doucment.getElementById('email').value;
    var address = document.getElementById('location').value;
    
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        console.log(results[0].geometry.location);
       
        var location = JSON.stringify(results[0].geometry.location);
       
        database.ref().push({
            location: location, // location determined by Geocoder
            // userLocation: address // this is the user input location
//            name: name,
            ingredient: ingredient,
//            email: email,
        });


        if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });

        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
        
        
        
    });
    
    return false;
}


$('.ingredient-button').on('click',function(){
    
     console.log($('.input-text').val());
   
    $('.add-product-col').hide();
    $('.get-product-col').hide();
   
    var newDiv = $('<div>');
    newDiv.addClass('col-sm-8 col-sm-offset-2 newDiv').html(initMap());
    

    
    $('.button-row').append(newDiv);
    
    $('.newDiv').append(initMap());
    
   
    
    console.log(newDiv);
    
    
    
    
    
});
var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};
var food = [];
database.ref().on('child_added', function(snapshot) {
         var contentString = snapshot.val().ingredient;
         console.log(contentString);
         food.push(contentString);
});
console.log(food);
$('#custom-search-input .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'food',
  source: substringMatcher(food)
});

        
                          
                           
                           
                           
                           
                           

function getLocationIngredient(){
    
    
}