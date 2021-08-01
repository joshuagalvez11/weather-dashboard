var startBtn = document.querySelector('#search');
var cityDiv = document.querySelector('#city-info');
var fiveDayDiv = document.querySelector('#five-day');
var recentsDiv = document.querySelector('#recent-searches');

if(localStorage.getItem("searches")){
    var searches = JSON.parse(localStorage.getItem("searches"));
    displayRecentSeaches();
}else{
    var searches = [];
}

function clearContent(clear) { //function to clear results from previous search
    while(clear.firstChild) {
        clear.removeChild(clear.firstChild);
    }
}

function displayRecentSeaches(){
    var recentsEL = document.createElement('div');
    recentsEL.className = 'recents';
    
    var recentTitleEl = document.createElement('h3');
    recentTitleEl.textContent = "Recents: ";

    document.querySelector('#recent-searches').appendChild(recentTitleEl);

    for(var i = 0; i < searches.length; i++){
        var recent = document.createElement('button');
        recent.textContent = searches[i];
        recent.className = 'recentBtn'

        document.querySelector('#recent-searches').appendChild(recent);
        console.log(recent.textContent);
        console.log(searches[i]);

        recent.addEventListener("click", function (){
            document.querySelector('#city').value = this.textContent;
            searchCoords(this.textContent);
        })
    }
}

function searchCoords(city) {
    clearContent(cityDiv);
    clearContent(fiveDayDiv);
    clearContent(recentsDiv);

    searches.push(city);
    console.log(searches);
    localStorage.setItem("searches", JSON.stringify(searches));

    displayRecentSeaches();

    fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&appid=4d9d20ab6631195c297f666e81854443')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            searchCity(city, data[0].lat, long = data[0].lon);    
        });
}

function searchCity(city, lat, long) {
    console.log(city);
    console.log(lat);
    console.log(long);
    fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+long+'&units=imperial&appid=4d9d20ab6631195c297f666e81854443')
        .then(response => response.json())
        .then(data => {
            console.log(data);

            var day = new Date();

            var cityEL = document.createElement('div');
            cityEL.className = 'city-result';

            var cityNameEl = document.createElement('h1');
            cityNameEl.textContent = city +  ` (${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()})`;
            cityNameEl.className = 'city-name-el';

            var tempEl = document.createElement('p');
            tempEl.textContent = "Temp: " + data.current.temp;
            tempEl.className = 'temp-el';

            var windEl = document.createElement('p');
            windEl.textContent = "Wind: " + data.current.wind_speed;
            windEl.className = 'wind-el';

            var humidityEl = document.createElement('p');
            humidityEl.textContent = "Humidity: " + data.current.humidity + '%';
            humidityEl.className = 'humidity-el';

            var uvEl = document.createElement('p');
            uvEl.textContent = "UV Index: " + data.current.uvi;
            uvEl.className = 'uv-el';

            cityEL.appendChild(cityNameEl);
            cityEL.appendChild(tempEl);
            cityEL.appendChild(windEl);
            cityEL.appendChild(humidityEl);
            cityEL.appendChild(uvEl);

            document.querySelector('#city-info').appendChild(cityEL);

            var titleEl = document.createElement('h1');
            titleEl.textContent = "Five Day Forecast: ";
            document.querySelector('#five-day').appendChild(titleEl);
                
            
            for(var i = 0; i < 5; i++){
                day.setDate(day.getDate() + 1);

                var fiveDayEL = document.createElement('div');
                fiveDayEL.className = "five-day Column";

                var dateEl = document.createElement('h3');
                dateEl.textContent = ` (${day.getMonth() + 1}/${day.getDate()}/${day.getFullYear()})`;
                dateEl.className = 'city-name-el';

                var weatherCastEl = document.createElement('p');
                weatherCastEl.textContent = data.daily[i].weather[0].main;
                weatherCastEl.className = 'weather-el';

                var tempCastEl = document.createElement('p');
                tempCastEl.textContent = "Temp: " + data.daily[i].temp.day;
                tempCastEl.className = 'temp-el';

                var windCastEl = document.createElement('p');
                windCastEl.textContent = "Wind: " + data.daily[i].wind_speed;
                windCastEl.className = 'wind-el';

                var humidityCastEl = document.createElement('p');
                humidityCastEl.textContent = "Humidity: " + data.daily[i].humidity + '%';
                humidityCastEl.className = 'humidity-el';

                fiveDayEL.appendChild(dateEl);
                fiveDayEL.appendChild(weatherCastEl);
                fiveDayEL.appendChild(tempCastEl);
                fiveDayEL.appendChild(windCastEl);
                fiveDayEL.appendChild(humidityCastEl);

                document.querySelector('#five-day').appendChild(fiveDayEL);
            }
        });
}


startBtn.addEventListener("click", function (){
    var search = document.querySelector('#city').value;
    searchCoords(search);
})