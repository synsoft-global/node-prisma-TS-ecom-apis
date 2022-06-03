export interface IUser {
    name: String;
    email: String;
    dob: String
}
export interface IUserPreference {
    id: Number;
    userId: Number;
    preferenceId: Number
}

export interface IUserSchema {
    name: String;
    email: String;
    dob: String;
    active: String;
    password?: String;
    preferences: IUserPreference[];
    token?: String;
    createdAt: Date
}

