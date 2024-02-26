const API_KEY = "AIzaSyBBo2fg362Rqsy9bPJIui5X98CN7plv7zU";

document.getElementById('contactForm').addEventListener('submit', function(evento) {
   evento.preventDefault();

   let nombre = document.getElementById('name').value;
   let email = document.getElementById('email').value;
   let subject = document.getElementById('subject').value;
   let mensaje = document.getElementById('message').value;

});

function initMap() {
    let storeLocation = {lat: 19.4326, lng: -99.1332};
    let map = new google.maps.Map(document.getElementById('map'), {zoom: 4,center: storeLocation});
    let marker = new google.maps.Marker({position: storeLocation,map: map})

}

window.onload = () => {
    let script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + API_KEY + '&callback=initMap';
    script.async = true;
    document.body.appendChild(script);
}