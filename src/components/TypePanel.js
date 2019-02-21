import React, { Component } from 'react';
import 'components/TypePanel.sass';

import secToTime from 'assets/util/sec-to-time.js';
import clone from 'assets/util/clone.js';

///////////////
// CONSTANTS //
///////////////

// How many seconds the game lasts
const GAME_DURATION = 60;

// Sample words that will come from an API later
const DICTIONARY = [
	"the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it",
	"for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but",
	"his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will",
	"my", "one", "all", "would", "there", "their", "what", "so", "up", "out",
	"if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like",
	"time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good",
	"some", "could", "them", "see", "other", "than", "then", "now", "look", "only",
	"come", "its", "over", "think", "also", "back", "after", "use", "two", "how",
	"our", "work", "first", "well", "way", "even", "new", "want", "because", "any",
	"these", "give", "day", "most", "us"
];

////////////////
// COMPONENTS //
////////////////

// Word component (each individual word in the TypePanel)
const Word = props => {
	const { text, completed, correct } = props.word;
	const { running } = props;

	let class_text = "";
	if(completed && correct) class_text = "correct";
	if(completed && !correct) class_text = "incorrect";
	if(running && (props.word === props.currentWord)) class_text = "current_word";

	return <span className={class_text}>{text}</span>;
}

// Type Panel Component
class TypePanel extends Component {

	constructor(props){
		super(props);
		this.state = {
			word_bank: DICTIONARY.map(word => ({text: word, completed: false, correct: false})),
			wpm: 0,
			timer: 0,
			timer_id: 0,
			running: false,
			input_val: ""
		}
		this.textInput = React.createRef();
	}

	startGame = () => {
		// Don't do anything if game is already running
		if(this.state.running) return;	

		// Every second update the timer and WPM counter
		const id = setInterval(() => {
			let next_timer = this.state.timer + 1;
			let next_wpm = this.state.word_bank.filter(w => w.correct).length / (next_timer / 60);
			if(GAME_DURATION - next_timer === 0) this.stopGame();
			this.setState({
				timer: next_timer,
				wpm: Math.floor(next_wpm)
			});
		}, 1000);

		// Reset word bank before starting again
		let reset_word_bank = this.state.word_bank.map(word => {
			word.completed = false;
			word.correct = false;
			return word;
		});

		// Store timer ID, enable `running` flag, reset wpm
		this.setState({
			word_bank: reset_word_bank,
			timer: 0,
			timer_id: id,
			running: true,
			wpm: 0
		});
	}

	stopGame = () => {
		// Don't do anything if game isn't running
		if(!this.state.running) return;

		// Lose focus on input
		this.textInput.current.blur();

		// Stop timer with stored timer ID
		clearInterval(this.state.timer_id);	

		// Reset state
		this.setState({
			timer_id: 0,
			running: false,
			input_val: ""
		});
	}

	// Handle input changes
	handleChange = e => {
		if(!this.state.running) this.startGame();
		this.setState({input_val: e.target.value.trim()});
	}

	// Listen for specific hotkeys in input field (space, enter)
	handleKeyDown = e => {
		if(e.keyCode === 32 || e.keyCode === 13){
			this.checkWordCorrectness(this.state.input_val);	
			this.setState({input_val: ""});
		}
	}

	// Validate if `text` matches the current word
	checkWordCorrectness = text => {
		let cloned_word_bank = clone(this.state.word_bank);
		let current_word = cloned_word_bank.find(word => !word.completed);

		if(text.trim() === current_word.text.trim()) current_word.correct = true;
		current_word.completed = true;

		this.setState({word_bank: cloned_word_bank});
	}

	render() {

		const { word_bank, wpm, timer, running, input_val } = this.state;
		const { textInput, handleChange, handleKeyDown } = this;
		const current_word = this.state.word_bank.find(word => !word.completed);

		return (
			<div className="TypePanel">
				<div className="word-box">
				{word_bank.map(word => (
					<Word key={word.text} running={running} word={word} currentWord={current_word} />
				))}
				</div>
				<input
					type="text"
					ref={textInput}
					onChange={e => handleChange(e)}
					onKeyDown={e => handleKeyDown(e)}	
					value={input_val}
					autoFocus={true}
				/>
				<section>
					<div className="stats">
						<p className="wpm">WPM: {wpm}</p>
						<p className="timer">{secToTime(GAME_DURATION - timer)}</p>
					</div>
				</section>
			</div>
		)
	}
}

export default TypePanel;
