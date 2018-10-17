var weather = (function () {
	'use strict';

	//
	// Variables
	//

	var locationUrl = 'http://ip-api.com/json';

	// Public APIs
	var publicAPIs = {};
	var settings;

	// Defaults
	var defaults = {
		// API Key for WeatherBit API, please add your own
		apiKey: 'Testing123',

		// Show temperature in Celcius or Fahrenheit
		// C for Celcius (default), F for Fahrenheit
		temperatureUnits: 'C',

		// Show weather icon for weather conditions
		// https://www.weatherbit.io/api/codes
		showWeatherIcon: true,

		// Selectors
		selectorApp: '#app',

		// Weather Message
		weatherMessage: function (temperature, conditions, location) {
			return 'It\'s currently ' + temperature + ' and ' + conditions + ' in ' + location + '.';
		}
	};

	// Merge two or more objects together
	var extend = function () {

		// Variables
		var extended = {};
		var deep = false;
		var i = 0;

		// Check if a deep merge
		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		// Merge the object into the extended object
		var merge = function (obj) {
			for (var prop in obj) {
				if (obj.hasOwnProperty(prop)) {
					// If property is an object, merge properties
					if (deep && Object.prototype.toString.call(obj[prop]) === '[object Object]') {
						extended[prop] = extend(extended[prop], obj[prop]);
					} else {
						extended[prop] = obj[prop];
					}
				}
			}
		};

		// Loop through each object and conduct a merge
		for (; i < arguments.length; i++) {
			var obj = arguments[i];
			merge(obj);
		}

		return extended;
	};

	var renderFailMessage = function() {
		var app = document.querySelector(settings.selectorApp);
		if (!app) return;

		app.innerHTML = 'Sorry, something unexpected happened. Please try again later.';
	};

	var renderWeather = function (data) {
		var app = document.querySelector(settings.selectorApp);
		if (!app) return;

		var content = '';

		if (settings.showWeatherIcon) {
			content += '<img src="https://www.weatherbit.io/static/img/icons/' + data.weather.icon + '.png" alt="Weather Icon">';
		}

		var degree = data.temp + '&deg;' + settings.temperatureUnits;
		content += '<div>' + settings.weatherMessage(degree, data.weather.description, data.city_name) + '</div>';

		app.innerHTML = content;
	};

	// Get user city location
	var getLocation = function () {
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) return;

			if (xhr.status >= 200 && xhr.status <= 300) {
				getWeatherCondition(JSON.parse(xhr.responseText).city);
			} else {
				renderFailMessage();
			}
		};

		xhr.open('GET', locationUrl);
		xhr.send();
	};

	var getWeatherCondition = function (location) {
		var unit = settings.temperatureUnits === 'C' ? 'M' : 'I';
		var url = 'https://api.weatherbit.io/v2.0/current?city=' + location + '&key=' + settings.apiKey + '&units=' + unit;
		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function () {
			if (xhr.readyState !== 4) return;

			if (xhr.status >= 200 && xhr.status <= 300) {
				renderWeather(JSON.parse(xhr.responseText).data[0]);
			} else {
				renderFailMessage();
			}
		};
		xhr.open('GET', url);
		xhr.send();
	};

	publicAPIs.init = function (options) {
		settings = extend(defaults, options || {});
		getLocation();
	};

	return publicAPIs;
})();

weather.init();
