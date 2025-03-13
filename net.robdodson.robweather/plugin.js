function load() 
{
	const getcity = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${countrycode}&appid=${apikey}`;
	console.log(`CITY = ${getcity}`);

	sendRequest(getcity)
	.then((latlon) =>
	{
		const citylatlon = JSON.parse(latlon);
		const weekday = ["sun","mon","tue","wed","thu","fri","sat"];
		const endpoint = `${site}&lat=${citylatlon[0].lat}&lon=${citylatlon[0].lon}&appid=${apikey}`;

		sendRequest(endpoint)
		.then((text) => 
		{
			let uri = endpoint;

			let date = new Date();
			const json = JSON.parse(text);
			
			let item = Item.createWithUriDate(uri, date);
			item.title = `${city} ${state} ${countrycode}`;

			//
			// now
			//
			let temp = Math.trunc(json.current.temp);

			item.body = `<p><b>Now:</b> ${temp}&deg; ${json.current.weather[0].description}</p>`;

			//
			// today
			//
			let mintemp = Math.trunc(json.daily[0].temp.min);
			let maxtemp = Math.trunc(json.daily[0].temp.max);
			let sunrise = new Date(json.daily[0].sunrise * 1000).toLocaleTimeString();
			let sunset = new Date(json.daily[0].sunset * 1000).toLocaleTimeString();
			let clouds = json.daily[0].clouds;
			let snow = json.daily[0].snow; // snow accum mm
			let uvi = json.daily[0].uvi;
			let cpop = json.hourly[0].pop; // precip prob
			let cpop3 = json.hourly[3].pop; // precip prob
			let cpop5 = json.hourly[5].pop; // precip prob

			item.body = item.body + `<p><b>Today</b> (${weekday[date.getDay()]}): ${mintemp}&deg; - ${maxtemp}&deg;<br>`;
			item.body += `${json.daily[0].weather[0].description}<br>`;
			item.body += `clouds: ${clouds}%<br>`;
			if (cpop != null)
			{
				item.body += `rain next hour: ${cpop * 100}%<br>`;
			}
			if (cpop3 != null)
			{
				item.body += `rain 3 hours: ${cpop3 * 100}%<br>`;
			}
			if (cpop5 != null)
			{
				item.body += `rain 5 hours: ${cpop5 * 100}%<br>`;
			}
			if (snow != null)
			{
				item.body += `snow accum: ${snow}mm<br>`;
			}
			item.body += `uvi: ${uvi}<br>`;
			item.body += `sunrise: ${sunrise}<br>`;
			item.body += `sunset: ${sunset}<br>`;
			item.body += `<i>${json.daily[0].summary}</i></p>`;

			//
			// tomorrow
			//
			let tomorrow = new Date(json.daily[1].dt * 1000)
			let tmintemp = Math.trunc(json.daily[1].temp.min);
			let tmaxtemp = Math.trunc(json.daily[1].temp.max);
			let tpop = json.daily[1].pop; // Probability of precipitation
			let tsnow = json.daily[1].snow; // snow accum mm
			let train = json.daily[1].rain; // rain accu mm
			let tuvi = json.daily[1].uvi;

			item.body += `<p><b>Tomorrow</b> (${weekday[tomorrow.getDay()]}): ${tmintemp}&deg; - ${tmaxtemp}&deg;<br>`;
			item.body += `${json.daily[1].weather[0].description}<br>`;
			if (tpop != null)
			{
				item.body += `rain chance: ${tpop * 100}%<br>`;
			}
			if (train != null)
			{
				item.body += `rain accum: ${train}mm<br>`;
			}
			if (tsnow != null)
			{
				item.body += `snow accum: ${tsnow}mm<br>`;
			}
			item.body += `uvi: ${tuvi}<br>`;
			item.body += `<i>${json.daily[1].summary}</i></p>`;

			let items = [item];
			processResults(items);
		})
		.catch((requestError) => 
		{
			processError(requestError);
		});
	});	
}
