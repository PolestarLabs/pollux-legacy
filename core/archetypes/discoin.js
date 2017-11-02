const request = require("request");
const rescodes = [200, 400, 401, 403];

module.exports = class Discoin {
	constructor (token){
		this.token = token;
	}
	request (user, amount, exchangeTo) {
		return new Promise((resolve, reject) => {
			request.post({url: "http://discoin.sidetrip.xyz/transaction", headers: {"Authorization": this.token}, json: {"user": user, "amount": amount, "exchangeTo": exchangeTo}}, function (error, response, body) {
				if (error || rescodes.indexOf(response.statusCode) === -1) {
					return reject("API failure - Contact MacDue");
				}
				if (response.statusCode !== 200) {
					return reject(body);
				}
				return resolve(body);
			});
		});
	}

	fetch () {
		return new Promise((resolve, reject) => {
			request({url: "http://discoin.sidetrip.xyz/transactions", headers: {"Authorization": this.token}}, function (error, response, body) {
				if (error || response.statusCode !== 200) {
					return reject("API failure - Contact MacDue");
				}
				return resolve(body);
			});
		});
	}

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

	info (receipt) {
		return new Promise((resolve, reject) => {
			request({url: "http://discoin.sidetrip.xyz/transaction/" + receipt, headers: {"Authorization": this.token}}, function (error, response, body) {
				if (error || response.statusCode !== 200) {
					return reject("API failure - Contact MacDue");
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
			request({url: "http://discoin.sidetrip.xyz/rates.json"}, function (error, response, body) {
				if (error || response.statusCode !== 200) {
					return reject("API failure - Contact MacDue");
				}
				return resolve(body);
			});
		});
	}
}
