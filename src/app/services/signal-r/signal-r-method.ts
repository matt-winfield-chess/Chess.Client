export enum SignalRMethod {
	// Incoming
	NewChallenge = 'NewChallenge',
	ChallengeAccepted = 'ChallengeAccepted',
	MovePlayed = 'MovePlayed',
	IllegalMove = 'IllegalMove',
	Checkmate = 'Checkmate',
	Stalemate = 'Stalemate',
	Resignation = 'Resignation',
	MoveReceived = 'MoveReceived',
	DrawOffer = 'DrawOffer',
	DrawOfferAccepted = 'DrawOfferAccepted',
	DrawOfferDeclined = 'DrawOfferDeclined',

	// Outgoing
	JoinGame = 'JoinGame',
	LeaveGame = 'LeaveGame',
	Move = 'Move',
}