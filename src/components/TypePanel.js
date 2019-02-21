import React, { Component } from 'react';
import 'components/TypePanel.sass';

import secToTime from 'assets/util/sec-to-time.js';
import clone from 'assets/util/clone.js';

// Sample words that will come from an API later
const dictionary = [
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

class TypePanel extends Component {

	constructor(props){
		super(props);
		this.state = {
			word_bank: dictionary.map(word => ({text: word, completed: false, correct: false})),
			wpm: 0,
			timer: 0,
			timer_id: 0,
			running: false,
			input_val: ""
		}
		this.textInput = React.createRef();
	}

	get current_word(){
		return this.state.word_bank.find(word => !word.completed);
	};

	startGame = () => {
		// Don't do anything if game is already running
		if(this.state.running) return;

		// Focus input field
		setTimeout(() => this.textInput.current.focus(), 30);	

		// Every second update the timer and WPM counter
		const id = setInterval(() => {	
			let next_timer = this.state.timer + 1;
			let next_wpm = this.state.word_bank.filter(w => w.correct).length / (next_timer / 60);
			this.setState({
				timer: next_timer,
				wpm: Math.floor(next_wpm)
			});
		}, 1000);

		// Store timer ID and enable `running` flag
		this.setState({
			timer_id: id,
			running: true
		});
	}

	stopGame = () => {
		// Don't do anything if game isn't running
		if(!this.state.running) return;

		// Stop timer with stored timer ID
		clearInterval(this.state.timer_id);

		// Reset state
		this.setState({
			timer: 0,
			timer_id: 0,
			running: false
		});
	}

	// Handle input field updates
	handleChange = e => {
		this.setState({input_val: e.target.value.trim()});
	}

	// Listen for specific hot keys in input field (space, enter)
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
		const { current_word, textInput, startGame, stopGame, handleChange, handleKeyDown } = this;

		return (
			<div className="TypePanel">
				<div className="word-box">
					{
						word_bank.map(word => {
							const { completed, correct } = word;
							let class_text = "";
							if(completed && correct) class_text = "correct";
							if(completed && !correct) class_text = "incorrect";
							if(word === current_word) class_text = "current_word";

							return <span className={class_text} key={word.text}>{word.text}</span>;
						})
					}
				</div>
				<input
					type="text"
					ref={textInput}
					onChange={e => handleChange(e)}
					onKeyDown={e => handleKeyDown(e)}
					disabled={!running}
					value={input_val}
				/>
				<section>
					<div className="controls">
						<button onClick={startGame}>Start</button>
						<button onClick={stopGame}>Stop</button>
					</div>
					<div className="stats">
						<p className="wpm">WPM: {wpm}</p>
						<p className="timer">{secToTime(timer)}</p>
					</div>
				</section>
			</div>
		)
	}
}

export default TypePanel;
