export enum SignalRMethod {
	// Incoming
	NewChallenge = 'NewChallenge',
	ChallengeAccepted = 'ChallengeAccepted',
	MovePlayed = 'MovePlayed',

	// Outgoing
	JoinGame = 'JoinGame',
	LeaveGame = 'LeaveGame',
	Move = 'Move',
}