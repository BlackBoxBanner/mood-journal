export const feels = [
	"happy",
	"sad",
	"angry",
	"excited",
	"nervous",
	"fearful",
	"anxious",
	"content",
	"joyful",
	"depressed",
	"enthusiastic",
	"bored",
	"calm",
	"relaxed",
	"stressed",
	"hopeful",
	"disappointed",
	"proud",
	"ashamed",
	"grateful",
	"jealous",
	"guilty",
	"embarrassed",
];

// Function to convert array of strings to binary number
export const feelsToBinary = (feelsArray: string[]): number => {
	let binary = 0;
	feelsArray.forEach((feel) => {
		const index = feels.indexOf(feel);
		if (index !== -1) {
			binary |= 1 << index;
		}
	});
	return binary;
};

// Function to convert binary number to array of strings
export const binaryToFeels = (binary: number): string[] => {
	const result: string[] = [];
	for (let i = 0; i < feels.length; i++) {
		if (binary & (1 << i)) {
			result.push(feels[i]);
		}
	}
	return result;
};
