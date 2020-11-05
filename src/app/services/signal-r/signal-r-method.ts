export enum SignalRMethod {
	// Incoming
	NewChallenge = 'NewChallenge',
	ChallengeAccepted = 'ChallengeAccepted',
	MovePlayed = 'MovePlayed',
	IllegalMove = 'IllegalMove',
	Checkmate = 'Checkmate',
	Stalemate = 'Stalemate',
	MoveReceived = 'MoveReceived',

	// Outgoing
	JoinGame = 'JoinGame',
	LeaveGame = 'LeaveGame',
	Move = 'Move',
}