import { ToastrService } from "ngx-toastr";
import { ApiResponse } from "../classes/models/api-response";

export class BaseComponent {
	constructor(protected toastr: ToastrService) { }

	protected async requestWithToastr<T>(request: () => Promise<ApiResponse<T>>, failureMessage: string,
		successMessage?: string, onSuccess?: (data: T) => void): Promise<T | null> {
		try {
			var response = await request();

			if (response.isSuccess) {
				if (successMessage) {
					this.toastr.success(successMessage);
				}

				if (onSuccess) {
					onSuccess(response.data);
				}

				return response.data;
			} else if (response.errors) {
				this.toastr.error(response.errors.join(', '), failureMessage);
			} else {
				this.toastr.error(failureMessage);
			}
		} catch {
			this.toastr.error(failureMessage);
		}
		return null;
	}
}
