const x: number = 5;

const showType = <T>(arg: T) => {
	console.log(`${arg}, ${typeof arg}`)
}

showType(5);

console.log("Some changes were made!")

