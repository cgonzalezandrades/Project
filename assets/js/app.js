// initialize firebase
var config = {
    apiKey: "AIzaSyDPANM_Lp4yJ2jWqr-MPK4pAT8HU5VQizA",
    authDomain: "testproject-ffd08.firebaseapp.com",
    databaseURL: "https://testproject-ffd08.firebaseio.com",
    storageBucket: "testproject-ffd08.appspot.com",
};
firebase.initializeApp(config);

var database = firebase.database();
var ingredient;
var imgURL;
//initial map variables
var geocoder;
var map;
var mapDisplayed = false;

//display map and center on Orlando, when "Get Ingredient" box is clicked

$("#get-product-text").on('click', function () {

    if (!mapDisplayed) {
        document.getElementById('map').style.display = "block";

        initMap();
        mapDisplayed = true;

    } else {
        return;
    }

});

//Function to display the map for the click function
function initMap() {
    jQuery.post( "https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDPANM_Lp4yJ2jWqr-MPK4pAT8HU5VQizA", function(success) {
        apiGeolocationSuccess({coords: {latitude: success.location.lat, longitude: success.location.lng}});
        })
    .fail(function(err) {
        alert("API Geolocation error! \n\n"+err);
    });

}; //end of init map

//function to record fields when the button is clicked
function codeAddress() {

    geocoder = new google.maps.Geocoder()
    var ingredient = document.getElementById('ingredient').value.trim();
    var email = document.getElementById('Email').value;
    var address = document.getElementById('location').value;
    var queryUrl = "http://api.ababeen.com/api/images.php?q=" + ingredient;
    console.log(queryUrl);
     $.ajax({ 
        url:queryUrl,
        success:function(data)
        { 
            data = $.parseJSON(data);
            imgURL = data[0].tbUrl;
            console.log(imgURL);
            console.log(data);
            geocoder.geocode({
                'address': address
            }, function (results, status) {
                console.log(results[0].geometry.location);
       
                var location = JSON.stringify(results[0].geometry.location);
       
                database.ref().push({
                location: location, // location determined by Geocoder
                // userLocation: address // this is the user input location
//               name: name,
                ingredient: ingredient,
                imgURL: imgURL,
                email: email,
                });


            if (status == 'OK') {
                
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        
        
        
        });

          // (Optional)  beautiful indented output.
          // $("#output").append(str); // Logs output to dev tools console.
       var form = document.getElementById("forIng");
        form.reset();
       
       },
       error:function(jqXHR,textStatus,errorThrown)
       {
        alert("You can not send Cross Domain AJAX requests : "+ errorThrown);
        console.log(errorThrown);
       }
      });
   
    
    return false;
}; //end of codeaddress

$('.ingredient-button').on('click',function(){
    
     console.log($('.input-text').val());
   
    $('.add-product-col').hide();
    $('.get-product-col').hide();
   
    var newDiv = $('<div>');
    newDiv.addClass('col-sm-8 col-sm-offset-2 newDiv').html(initMap());
    

    
    $('.button-row').append(newDiv);
    
    $('.newDiv').append(initMap());
    
   
    
    console.log(newDiv);
    
    
    
    
    
})
// code for Typeahead package       
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
// array to store database items from Firebase
var food = []
//calling firebase to pull the ingredient items into the "food" array
database.ref().on('child_added', function(snapshot) {
         var contentString = snapshot.val().ingredient;
         food.push(contentString)
});
console.log(food);
$('#custom-search-input .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1,
  classNames: {
    input: 'tt-input',
    hint: 'tt-hint',
    selectable: 'Typeahead-selectable'
  }
},
{
  name: 'ingredients',
  source: substringMatcher(food)
});

function handleLocationError(browserHasGeolocation, centerMarker, pos) {
  centerMarker.setPosition(pos);
  alert(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
};

//function after map is initiated to display current availalble ingredients
apiGeolocationSuccess = function(position) {
    var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
        }
    var latlng = new google.maps.LatLng(28.495, -81.400);
    var mapOptions = {
        zoom: 10,
        center: latlng,
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);
    var centerMarker = new google.maps.Marker({
            map: map,});
    centerMarker.setPosition(pos);
      
    map.setCenter(pos);

    database.ref().on("child_added", function (snapshot) {
        //content for the info window when clicking on marker
        var ing = snapshot.val().ingredient;
        var contact = snapshot.val().email;
        var contentString = "Ingredient: "+ing+"</br> Contact: "+contact
        //format of the image that replaces the standard google maps marker
        var image = {url: (snapshot.val().imgURL),
            scaledSize: new google.maps.Size(40,40),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(0, 0),
            };
        //item location from firebase
        var itemLocation = JSON.parse(snapshot.val().location);
        var locationForDiv = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + itemLocation.lat + "," + itemLocation.lng + "&key=AIzaSyAdC7G5MC9G8uxPUYabGBD93xL-lyzRu54"

        //creating info windo
        var infowindow = new google.maps.InfoWindow({
            content: contentString,
        });
        //place marker on the map
        var marker = new google.maps.Marker({
            position: itemLocation,
            map: map,
            icon: image,
            title: 'Ingredients'
        });
        //open info window when clicking on the marker
        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
    });
};