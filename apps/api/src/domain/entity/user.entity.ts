import {Option} from "fp-ts/Option";
import {FileMetadata} from "@entity/file.entity";

export type User = {
	id: string;
	email: string;
	firstname: string;
	lastname: string;
	password?: string;
	profilePictureFile?: string;
	profilePictureUpdatedBy?: string;
	profilePictureUpdatedAt?: Date;
	createdAt: Date;
	createdBy?: string;
	updatedAt?: Date;
	updatedBy?: string;
	deletedAt?: Date;
	deletedBy?: string;
};

export type PublicUser = Omit<User, "password">;

export type CreateUser = {
	email: string;
	firstname: string;
	lastname: string;
	password: string;
	createdBy?: string;
};

export type UpdateUser = {
	email?: string;
	firstname?: string;
	lastname?: string;
	updatedBy?: string;
};

export type ListUsers = {
    users: {
        user: PublicUser;
        file: Option<FileMetadata>;
    }[];
    total: number;
}

export type UpdateUserProfilePicture = {
	profilePictureFile?: string;
	profilePictureUpdatedBy?: string;
};
