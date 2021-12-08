import moment from "moment";
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

export const stripHtmlTags = (input) => {
	return input.replace(/<(?:.|\n)*?>/gm, "");
};

//function to filter out all http or https or www in strings
const filterHttpOut = (str) => {
	const arrOfStr = str.split(" ");
	const res = arrOfStr.filter((link) => {
		return link.indexOf("https") === -1;
	});
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
			return `<br /><a href="${e}" target="_blank">${e}</a>`;
		});
		const mainUrl = singleurl ? revdHttp + singleurl : revdHttp;
		return mainUrl;
	});
	return replacement;

	// findUrl(stringWithLinks);

	// filterHttpOut(stringWithLinks);
};
