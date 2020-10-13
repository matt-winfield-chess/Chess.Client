export class ApiResponse<T> {
	public data: T;
	public errors: string[];
	public isSuccess: boolean;
}
