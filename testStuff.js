function isDigits(number) {
	const numberArr = number.toString().split('').reverse();

	let digitsCount = 0;

	for (const num of numberArr) {
		if (num === numberArr[0]) {
			digitsCount++;
		} else {
			break;
		}
	}

	return digitsCount;
}

console.log(isDigits(123143444244));
