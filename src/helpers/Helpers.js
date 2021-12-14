import moment from "moment";
import _ from "lodash";
export const formatDate = (date) => {
	return moment(date).fromNow();
};

export const shortenText = (string, length) => {
	if (string.length > length && string.length > 0) {
		let newString = string + "";
		newString = string.substr(0, length);
		newString = string.substr(0, newString.lastIndexOf(" "));
		newString = newString.length > 0 ? newString : string.substr(0, length);
		return newString + "... Read More";
	}
	return string;
};

export const shortenMsgText = (string, length) => {
	if (string.length > length && string.length > 0) {
		let newString = string + "";
		newString = string.substr(0, length);
		newString = string.substr(0, newString.lastIndexOf(" "));
		newString = newString.length > 0 ? newString : string.substr(0, length);
		return newString + "...";
	}
	return string;
};

export const stripHtmlTags = (input) => {
	return input.replace(/<(?:.|\n)*?>/gm, "");
};

//function to filter out all http or https or www in strings
const filterHttpOut = (str) => {
	const arrOfStr = str.split(" ");
	const res = arrOfStr.filter((link) => {
		return link.indexOf("https") === -1;
	});
	// console.log(res.join(" "));
	return res.join(" ");
};
const findUrl = (str) => {
	let regex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
	let match = str.match(regex);
	return match;
};

export const detectLinks = (string) => {
	let regex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
	const revdHttp = filterHttpOut(string);
	const arr = findUrl(string);
	let replacement = string.replace(regex, () => {
		const singleurl = arr.map((e) => {
			return `<a href="${e}" target="_blank">${e}</a>`;
		});
		return _.uniq(singleurl).join(" ");
	});
	return replacement;
};
