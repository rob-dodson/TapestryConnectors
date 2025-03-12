function load() 
{
	const getcity = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${countrycode}&appid=${apikey}`;
	console.log(`CITY = ${getcity}`);

	sendRequest(getcity)
	.then((latlon) =>
	{
		const citylatlon = JSON.parse(latlon);

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
			let temp=  Math.trunc(json.current.temp);
			item.body = `<p>${city} ${state} ${countrycode}</p>`;
			item.body = item.body + `<p><b>Now:</b> ${temp}f ${json.current.weather[0].description}</p>`;
			item.body = item.body + `<p><b>Today:</b> ${json.daily[0].summary}</p>`;
			item.body = item.body + `<p><b>Tomorrow:</b> ${json.daily[1].summary}</p>`;

			let items = [item];
			processResults(items);
		})
		.catch((requestError) => 
		{
			processError(requestError);
		});
	});	
}
