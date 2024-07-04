const axios = require("axios");

const options = {
  method: 'GET',
  url: 'https://zillow-com1.p.rapidapi.com/locationSuggestions',
  params: {q: 'santa monica, ca'},
  headers: {
    'X-RapidAPI-Key': 'eef0c6e3c3mshdb435e364f5b8fap1465f7jsnf208172d3827',
    'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
  }
};

axios.request(options).then(function (response) {
	console.log(JSON.stringify(response.data));
}).catch(function (error) {
	console.error(error);
});