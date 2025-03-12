function load() 
{
	const getcity = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${countrycode}&appid=${apikey}`;
	console.log(`CITY = ${getcity}`);

	sendRequest(getcity)
	.then((latlon) =>
	{
		const citylatlon = JSON.parse(latlon);
		const weekday = ["sun","mon","tue","wed","thu","fri","sat"];

		console.log(`SITE0 = ${site}`);
	
		const endpoint = `${site}&lat=${citylatlon[0].lat}&lon=${citylatlon[0].lon}&appid=${apikey}`;

		console.log(`SITE1 = ${endpoint}`);
		
		sendRequest(endpoint)
		.then((text) => 
		{
			let uri = site;

			let date = new Date();
			const json = JSON.parse(text);
			
			let item = Item.createWithUriDate(uri, date);

			//
			// now
			//
			let temp = Math.trunc(json.current.temp);
			item.title = `${city} ${state} ${countrycode}`;
			item.body = `<p><b>Now:</b> ${temp}&deg; ${json.current.weather[0].description}</p>`;

			//
			// today
			//
			let mintemp = Math.trunc(json.daily[0].temp.min);
			let maxtemp = Math.trunc(json.daily[0].temp.max);
			let sunrise = new Date(json.daily[0].sunrise * 1000).toLocaleTimeString();
			let sunset = new Date(json.daily[0].sunset * 1000).toLocaleTimeString();

			item.body = item.body + `<p><b>Today</b> (${weekday[date.getDay()]}): ${mintemp}&deg; - ${maxtemp}&deg;<br>`;
			item.body = item.body + `${json.daily[0].weather[0].description}<br>`;
			item.body = item.body + `sunrise: ${sunrise}<br>`;
			item.body = item.body + `sunset: ${sunset}<br>`;
			item.body = item.body + `${json.daily[0].summary}</p>`;

			//
			// tomorrow
			//
			let tomorrow = new Date(json.daily[1].dt * 1000)
			let tmintemp = Math.trunc(json.daily[1].temp.min);
			let tmaxtemp = Math.trunc(json.daily[1].temp.max);

			item.body = item.body + `<p><b>Tomorrow</b>(${weekday[tomorrow.getDay()]}): ${tmintemp}&deg; - ${tmaxtemp}&deg;<br>`;
			item.body = item.body + `${json.daily[1].weather[0].description}<br>`;
			item.body = item.body + `${json.daily[1].summary}</p>`;

			let items = [item];
			processResults(items);
		})
		.catch((requestError) => 
		{
			processError(requestError);
		});
	});	
}
