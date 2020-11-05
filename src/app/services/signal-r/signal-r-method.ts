export enum SignalRMethod {
	// Incoming
	NewChallenge = 'NewChallenge',
	ChallengeAccepted = 'ChallengeAccepted',
	MovePlayed = 'MovePlayed',
	IllegalMove = 'IllegalMove',
	Checkmate = 'Checkmate',
	Stalemate = 'Stalemate',

	// Outgoing
	JoinGame = 'JoinGame',
	LeaveGame = 'LeaveGame',
	Move = 'Move',
}