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

        
                          
                           
                           
                           
                           
                           

function getLocationIngredient(){
    
    
}