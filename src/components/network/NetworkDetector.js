export const NetworkDetector = () => {
	let isDisconnected;
	const ConnectionChange = () => {
		const condition = navigator.onLine ? "online" : "offline";

		// if (navigator.connection.downlink === 10) {
		// 	condition = "off";
		// } else if (navigator.connection.downlink === 1.2) {
		//     condition = "no internet connection";
		// } else {
		// 	condition = "connection active";
		// }
		// console.log(navigator);
		isDisconnected = condition;
	};

	window.addEventListener("online", ConnectionChange);
	window.addEventListener("offline", ConnectionChange);

	ConnectionChange();
	return isDisconnected;
};
