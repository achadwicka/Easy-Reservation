/* eslint-disable */
$(() => {
  $('#map').append(() => {
    map = initMap();
  });
});

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: new google.maps.LatLng(-33.4995869, -70.6154386),
  });

  const req = $.ajax({
    url: '/returnRestaurant/map-ajax-search',
    method: 'post',
  });

  req.done((restaurants) => {
    for (let i = 0; i < restaurants.length; i++) {
      const contentString = `<h1>${restaurants[i].nickname}</h1> <hr> <p> ${restaurants[i].address}</p> <hr> <a href="/restaurants/${restaurants[i].id}"> Ir al Restaurant </a>`;

      const LatLng = new google.maps.LatLng(restaurants[i].lat, restaurants[i].lng);

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      const marker = new google.maps.Marker({
        position: LatLng,
        map
      });

      marker.addListener('click', () => {
        infowindow.open(map, marker);
      });
    }
    });
  return map;
}
