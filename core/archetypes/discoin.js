const request = require("request");
const rescodes = [200, 201, 400, 401, 403];

module.exports = class Discoin {
	constructor (token){
		this.token = token;
	}
	request (user, amount, exchangeTo) {
		return new Promise((resolve, reject) => {
			request.post({url: "https://discoin.zws.im/transactions", headers: {"Authorization": "Bearer " + this.token}, json: {"user": user, "amount": amount, "toId": exchangeTo}}, function (error, response, body) {
				if (error || rescodes.indexOf(response.statusCode) === -1) {
					return reject("API failure - Contact PizzaFox");
				}
				if (response.statusCode !== 201) {
					return reject(body);
				}
				return resolve(body);
			});
		});
	}

	fetch () {
		return new Promise((resolve, reject) => {
			request({url: "https://discoin.zws.im/transactions?s=%7B%22to.id%22%3A%20%22RBN%22%2C%20%22handled%22%3A%20false%7D"}, function (error, response, body) {
				if (error || response.statusCode !== 200) {
					return reject("API failure - Contact PizzaFox");
				}
				return resolve(body);
			});
		});
	}

	process (receipt) {
		return new Promise((resolve, reject) => {
			request.patch({url: "https://discoin.zws.im/transactions/"+receipt, headers: {"Authorization": "Bearer " + this.token}, json: {"handled": true} }, function (error, response, body) {
				if (error || response.statusCode !== 200) {
					return reject("API failure - Contact PizzaFox");
				}
				return resolve(body);
			});
		});
	}

	/*
	reverse (receipt) {
		return new Promise((resolve, reject) => {
			request.post({url: "http://discoin.sidetrip.xyz/transaction/reverse", headers: {"Authorization": this.token}, json: {"receipt": receipt}}, function (error, response, body) {
				if (error || response.statusCode !== 200) {
					return reject("API failure - Contact MacDue");
				}
				return resolve(body);
			});
		});
	}
	*/

	info (receipt) {
		return new Promise((resolve, reject) => {
			request({url: "https://discoin.zws.im/transactions/" + receipt}, function (error, response, body) {
				if (error || response.statusCode !== 200) {
					return reject("API failure - Contact PizzaFox");
				}
				if (response.statusCode !== 200) {
					return reject(body);
				}
				return resolve(body);
			});
		});
	}

	rates () {
		return new Promise((resolve, reject) => {
			request({url: "https://discoin.zws.im/currencies"}, function (error, response, body) {
				if (error || response.statusCode !== 200) {
					return reject("API failure - Contact PizzaFox");
				}
				return resolve(body);
			});
		});
	}
}
