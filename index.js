const game_element = document.querySelector('#game');

const player_one = document.getElementById('player_one');
const player_two = document.getElementById('player_two');

const player_one_score = document.getElementById('score_player_one');
const player_two_score = document.getElementById('score_player_two');

const current_player = document.querySelector('.current_player');
const play_again_button = document.querySelector('.play_again');

class Game {
	constructor() {
		this.field = [];
		this.first_check = null;
		this.second_check = null;
		this.move = 0;
		this.first_player_score = 0;
		this.second_player_score = 0;
		this.isFirstPlayer = true;
	}

	createGame() {
		this.field = shuffleArray(
			[...listFruits, ...listFruits].map((item, i) => {
				return { ...item, id: i };
			})
		);

		for (let i = 0; i < this.field.length; i++) {
			let item = document.createElement('div');
			item.setAttribute('class', 'item');
			item.setAttribute('id', this.field[i].id);

			item.onclick = () => this.compareItem(this.field[i]);

			let image_item = document.createElement('img');
			image_item.setAttribute('src', 'src/images/hidden.png');

			item.appendChild(image_item);

			game_element.appendChild(item);
		}
	}

	compareItem(element) {
		const localElement = document.getElementById(element.id);

		if (localElement.getAttribute('class').split(' ')[1] === 'animation')
			return;

		localElement.setAttribute('class', 'item animation');

		if (this.first_check === null) {
			localElement.innerHTML = `<img src='${element.image}' alt='${element.name}' />`;
			this.first_check = element;
		} else if (this.second_check === null) {
			localElement.innerHTML = `<img src='${element.image}' alt='${element.name}' />`;

			this.second_check = element;

			setTimeout(() => {
				if (this.first_check.name === this.second_check.name) {
					if (this.isFirstPlayer) {
						this.first_player_score++;
					} else {
						this.second_player_score++;
					}

					this.move++;

					this.first_check = null;
					this.second_check = null;
				} else {
					this.hideElement();
					this._changePlayer();
				}

				this.updateStats();
			}, 600);
		}
	}

	_changePlayer = () => (this.isFirstPlayer = !this.isFirstPlayer);

	hideElement() {
		const first_element = document.getElementById(this.first_check.id);
		const second_element = document.getElementById(this.second_check.id);

		first_element.innerHTML = `<img src='src/images/hidden.png' alt='hidden'/>`;
		second_element.innerHTML = `<img src='src/images/hidden.png' alt='hidden'/>`;

		first_element.setAttribute('class', 'item');
		second_element.setAttribute('class', 'item');

		this.first_check = null;
		this.second_check = null;
	}

	updateStats() {
		player_one_score.innerHTML = this.first_player_score;
		player_two_score.innerHTML = this.second_player_score;

		if (this.move === 6) {
			current_player.innerHTML =
				this.first_player_score > this.second_player_score
					? 'Congratulations first player!'
					: 'Congratulations second player!';

			play_again_button.setAttribute('class', 'play_again visible');
		} else {
			document.querySelector('.current_player').innerHTML =
				this.first_player_score === this.second_player_score
					? 'Draw now!'
					: this.first_player_score > this.second_player_score
					? 'The first player is in the lead!'
					: 'The second player goes to the top!';
		}

		if (this.isFirstPlayer) {
			player_one.setAttribute('class', 'player_one current');
			player_two.setAttribute('class', 'player_two');
		} else {
			player_one.setAttribute('class', 'player_two');
			player_two.setAttribute('class', 'player_two current');
		}
	}

	restartGame() {
		//Reinitializate value in class
		this.field = [];
		this.first_check = this.second_check = null;
		this.first_player_score = this.second_player_score = this.move = 0;
		this.isFirstPlayer = true;

		//Reinitializate value in DOM element
		game_element.innerHTML = '';
		current_player.innerHTML = 'Just start now!';
		player_one_score.innerHTML = player_two_score.innerHTML = '0';

		player_one.setAttribute('class', 'player_one current');
		player_two.setAttribute('class', 'player_two');

		play_again_button.setAttribute('class', 'play_again');

		this.createGame();
	}
}

const game = new Game();

game.createGame();

document.querySelector('.play_again').onclick = () => game.restartGame();
