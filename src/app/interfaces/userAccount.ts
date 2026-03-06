export interface UserAccount {
	email: string,
	firstName: string,
	lastName: string,
	isVerified: number,
	accept: boolean,
	delete: boolean
}
export interface UserCollection {
	verifiedUsers: UserAccount[],
	unverifiedUsers: UserAccount[]
}

