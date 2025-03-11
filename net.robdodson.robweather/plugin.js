function load() {
let uri = site;
	const endpoint = `${site}`;
	sendRequest(endpoint)
	.then((text) => {

		let date = new Date();
		const json = JSON.parse(text);
	    
		//let uri = site + `?value=${json.value}&timestamp=${json.timestamp}`;
		let item = Item.createWithUriDate(uri, date);
		let temp=  Math.trunc(json.current.temp);
		item.body = `<p>Tacoma</p>`;
		item.body = item.body + `<p><b>Now:</b> ${temp}f ${json.current.weather[0].description}</p>`;
		item.body = item.body + `<p><b>Today:</b> ${json.daily[0].summary}</p>`;
		item.body = item.body + `<p><b>Tomorrow:</b> ${json.daily[1].summary}</p>`;

		let items = [item];
		processResults(items);
	})
	.catch((requestError) => {
		processError(requestError);
	});
}
