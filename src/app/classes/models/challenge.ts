import { User } from './user';
import { ChallengerColor } from '../../enums/challenger-color.enum';

export class Challenge {
	public challenger: User;
	public recipient: User;
	public challengerColor: ChallengerColor;
}
