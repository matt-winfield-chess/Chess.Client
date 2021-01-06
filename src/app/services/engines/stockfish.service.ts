import { Injectable } from '@angular/core';
import { Move } from 'src/app/classes/move';
import { CoordinateNotationParserService } from '../coordinate-notation-parser.service';

@Injectable({
	providedIn: 'root'
})
export class StockfishService {

	private hasInitialisationStarted: boolean = false;
	private hasLoaded: boolean = false;
	private debugOutput: boolean = true;
	private stockfish: Worker;
	private state: string = "Loading";
	private difficulty: number = 10;

	private calculatingPromise: Promise<string> = null;
	private calculatingPromiseResolutionCallback: (value: string | PromiseLike<string>) => void = null;

	constructor(private coordinateNotationParser: CoordinateNotationParserService) { }

	public start(): void {
		if (!this.hasInitialisationStarted) {
			var wasmSupported = typeof WebAssembly === 'object' && WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
			console.log(`WASM Supported: ${wasmSupported}`);
			this.stockfish = new Worker(wasmSupported ? 'assets/stockfish.js/stockfish.wasm.js' : 'assets/stockfish.js/stockfish.js', { type: `module` });

			this.stockfish.addEventListener('message', e => this.handleStockfishMessage(e.data));

			this.stockfish.postMessage('uci');
		}
	}

	public isReady(): boolean {
		return this.hasLoaded;
	}

	public getState(): string {
		return this.state;
	}

	public async calculateMove(moves: Move[]): Promise<string> {
		if (this.calculatingPromise) {
			await this.calculatingPromise;
		}

		this.stockfish.postMessage('ucinewgame');

		var positionMessage = 'position startpos'

		if (moves.length > 0) {
			positionMessage += ' moves';

			for (var move of moves) {
				positionMessage += ` ${this.coordinateNotationParser.convertMoveToNotation(move)}`
			}
		}

		this.stockfish.postMessage(positionMessage);
		this.stockfish.postMessage(`go depth ${this.getCalculationDepth()}`);
		this.state = "Thinking";

		var calculatingPromise = new Promise<string>((resolve, reject) => {
			this.calculatingPromiseResolutionCallback = resolve;
		})

		this.calculatingPromise = calculatingPromise;
		return calculatingPromise;
	}

	public setDifficulty(level: number) {
		this.difficulty = level;
		this.stockfish.postMessage(`setoption name Skill Level value ${this.difficulty * 2}`)
	}

	public getDifficulty(): number {
		return this.difficulty;
	}

	private handleStockfishMessage(data: string): void {
		if (this.debugOutput) {
			console.log(data);
		}

		if (data.includes('uciok')) {
			this.hasLoaded = true;
			this.state = "Ready";
		}

		if (data.startsWith('bestmove')) {
			var bestMove = data.split(' ')[1];
			this.calculatingPromiseResolutionCallback(bestMove);
			this.state = "Ready";
		}
	}

	private getCalculationDepth(): number {
		if (this.difficulty <= 4) {
			return 5;
		}

		if (this.difficulty <= 7) {
			return 10;
		}

		return 20;
	}
}
