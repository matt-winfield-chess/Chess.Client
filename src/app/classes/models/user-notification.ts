export class UserNotification {
	public title: string;
	public details: string;
	public acceptText: string;
	public acceptCallback: () => void;
	public declineText: string;
	public declineCallback: () => void;
}
