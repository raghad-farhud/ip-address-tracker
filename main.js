// get info from dom
let ipAdd = document.querySelector(".ip-add p");
let locationIP = document.querySelector(".location p");
let utcIP = document.querySelector(".utc p");
let ispIP = document.querySelector(".isp p");
// form input
let inputTxt = document.querySelector("form input");
let sbmtBtn = document.querySelector("form button");

sbmtBtn.addEventListener("click", (e) => {

  e.preventDefault();
  fetch(`https://ipapi.co/${inputTxt.value}/json/`)
  .then(res => res.json())
  .then(data => renderResult(data))
  .catch(error => displayError(error));

});

const map = L.map('map').setView([0, 0], 13);
const tileUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

L.tileLayer(tileUrl, {
    maxZoom: 18,
    attribution: false,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(map);


fetch(`https://ipapi.co/${inputTxt}/json/`)
.then(function(response) {
  response.json().then(jsonData => {
    console.log(jsonData);
  });
})
.catch(function(error) {
  console.log(error)
});

// when loading the page get the user ip
fetch('https://ipapi.co/json/')
.then((response) => {
  response.json().then(jsonData => renderResult(jsonData));
})
.catch((error) => {
  displayError(error);
});

function renderResult(jsonData) {
  if (jsonData.error) {
    throw(`${jsonData.reason}`);
  }
  locationIP.textContent = `${jsonData["country_name"]} ${jsonData["country"]}, ${jsonData["city"]}`;
  ispIP.textContent = `${jsonData["org"]}`;
  ipAdd.textContent = `${jsonData["ip"]}`;
  
  if(jsonData["utc_offset"] !== null) {
    utcIP.textContent = `UTC ${jsonData.utc_offset.slice(0, 3) + ':' + jsonData.utc_offset.slice(3)}`;
  } else {
    utcIP.textContent = jsonData.timezone;
  }

  map.setView([jsonData.latitude, jsonData.longitude], 13);
  marker.setLatLng([jsonData.latitude, jsonData.longitude]);
  marker.bindPopup(`<b>${jsonData.ip}</b>`).openPopup();
}

function displayError(error) {
  let erMsg = document.querySelector("p.error");
  erMsg.textContent = error;
  setTimeout(() => {
    erMsg.textContent = "";
  }, 3000);
}