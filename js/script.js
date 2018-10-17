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

	//
	// Methods
	//

	/**
	 * Sanitize and encode all HTML in a user-submitted string
	 * @param  {String} str  The user-submitted string
	 * @return {String} str  The sanitized string
	 */
	var sanitizeHTML = function (str) {
		var temp = document.createElement('div');
		temp.textContent = str;
		return temp.innerHTML;
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
			content += '<img src="https://www.weatherbit.io/static/img/icons/' + sanitizeHTML(data.weather.icon) + '.png" alt="Weather Icon">';
		}

		var degree = sanitizeHTML(data.temp) + '&deg;' + settings.temperatureUnits;
		content += '<div>' + settings.weatherMessage(degree, sanitizeHTML(data.weather.description), sanitizeHTML(data.city_name)) + '</div>';

		app.innerHTML = content;
	};

	var makeRequest = function () {

		// Set up our HTTP request
		var xhr = new XMLHttpRequest();

		// Set up our listener to process request state changes
		xhr.onreadystatechange = function () {

			// Only run if the request is complete
			if (xhr.readyState !== 4) return;

			// Process our return data
			if (xhr.status >= 200 && xhr.status <= 300) {

				// Get user city location and pass it into weather conditions request
				getWeatherCondition(JSON.parse(xhr.responseText).city);
			} else {
				renderFailMessage();
			}
		};

		xhr.open('GET', locationUrl);
		xhr.send();
	};

	var getWeatherCondition = function (location) {
		// Set up parameters for the request URL
		var unit = settings.temperatureUnits === 'C' ? 'M' : 'I';
		var url = 'https://api.weatherbit.io/v2.0/current?city=' + location + '&key=' + settings.apiKey + '&units=' + unit;

		// Set up our HTTP Request
		var xhr = new XMLHttpRequest();

		// Set up our listener to process request state changes
		xhr.onreadystatechange = function () {

			// Only run if the request is complete
			if (xhr.readyState !== 4) return;

			// Process our return data
			if (xhr.status >= 200 && xhr.status <= 300) {

				// Render the weather condition
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
		makeRequest();
	};

	return publicAPIs;
})();

weather.init();
