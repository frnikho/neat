export type FileMetadata = {
  id: string;
  name: string;
  description: string;
  key: string;
  bucket: string;
  size: number;
  contentType: string;
  isPublic: boolean;
  createdAt: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  deletedAt?: Date;
  deletedBy?: string;
};

export type CreateFileMetadata = {
  name: string;
  description: string;
  key: string;
  bucket: string;
  size: number;
  contentType: string;
  isPublic?: boolean;
  createdBy?: string;
};

export type UpdateFileMetadata = {
  name?: string;
  description?: string;
  updatedBy?: string;
};
