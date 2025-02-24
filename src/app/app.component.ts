import { Component } from '@angular/core';
import { SocketService } from './socket.service';
import { JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Game } from './game.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  gameId: string = '';
  playerId: string = '';
  word: string = '';
  gameData: any = null;
  playerNameisSet = false
  wordSent = false
  isPrivate = true
  games: Game[] = []

  constructor(private socketService: SocketService) { }

  ngOnInit() {
    this.socketService.listen('error').subscribe((err) => {
      console.log("eer", err)
    });

    this.socketService.listen('gameListChanged').subscribe((games: any) => {
      this.games = games;
    });

    this.socketService.listen('gameCreated').subscribe((game: any) => {
      console.log(game)
      this.gameData = game;
      this.gameId = game.id
    });

    this.socketService.listen('playerJoined').subscribe((game: any) => {
      this.gameData = game;
      this.gameId = game.id
    });

    this.socketService.listen('wordAdded').subscribe((game: any) => {
      this.wordSent = !game.wordsFilled
      this.gameData = game;
    });

    this.socketService.listen('gameFinished').subscribe((game) => {
      console.log("finished", game)
      this.gameData = game;
    });
  }

  createGame() {
    this.socketService.emit('createGame', { playerName: this.playerId, isPrivate: this.isPrivate });
  }

  joinGame(gameID: string = this.gameId) {
    if (this.playerId.trim()) {
      console.log("Join")
      console.log(this.gameId, this.playerId)
      this.socketService.emit('joinGame', { gameId: gameID, playerName: this.playerId });
    }
  }

  sendWord() {
    if (this.word.trim()) {
      this.wordSent = true
      this.socketService.emit('sendWord', { gameId: this.gameId, word: this.word, playerName: this.playerId });
      this.word = '';
    }
  }

  setPlayerName() {
    if (this.playerId !== '') {
      this.playerId = this.playerId.trim()
      this.playerNameisSet = true
      this.socketService.emit('addPlayerToLobby');
    }
  }

  restart() {
    this.gameData = null
    this.wordSent = false
  }
}
