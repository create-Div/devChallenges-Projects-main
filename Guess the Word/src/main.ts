import ky from "ky";

const wordDisplayEl = document.querySelector("#game-container .word-display");
const triesAmountEl = document.querySelector("#stats .tries");
const mistakesAmountEl = document.querySelector("#stats .mistakes");
const dotsEls = document.querySelectorAll(".dot");
const randomBtnEl = document.querySelector(".random");
const resetBtnEl = document.querySelector(".reset");

let gameOver = false;
let word: string;

function handleKeyPress(e: KeyboardEvent) {
	if (gameOver) return;
	const key = e.key;
	if (key.length === 1 && /[a-z]/i.test(key)) {
		console.log(key);
	}
}

function gameReset() {
	gameOver = false;
}

function randomNumberInRange(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function fetchWord() {
	const wordLength = randomNumberInRange(4, 7);

	try {
		const data = await ky
			.get(
				`https://random-word-api.herokuapp.com/word?number=1&length=${wordLength}`,
			)
			.json<string[]>();

		word = data[0];
		console.log(word);
	} catch (err) {
		console.error("Fetch failed:", err);
	}
}

async function initGame() {
	fetchWord();
}

resetBtnEl?.addEventListener("click", gameReset);

window.addEventListener("keydown", handleKeyPress);

initGame();
