import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const PRESIGNED_PUT_URL_EXPIRATION_IN_MINUTES = 15;
const PRESIGNED_GET_URL_EXPIRATION_IN_MINUTES = 30;

const s3Client = new S3Client({});

export function getExternalS3Arn(bucket: string) {
  return `arn:aws:s3:::${bucket}`;
}

export function getS3PresignedPutUrl(
  bucket: string,
  objectKey: string,
  contentType: string,
  presignedUrlExpirationInMinutes: number = PRESIGNED_PUT_URL_EXPIRATION_IN_MINUTES,
) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ContentType: contentType,
  });
  return getSignedUrl(s3Client, command, {
    expiresIn: presignedUrlExpirationInMinutes * 60,
  });
}

export function getS3PresignedGetUrl(
  bucket: string,
  objectKey: string,
  presignedUrlExpirationInMinutes: number = PRESIGNED_GET_URL_EXPIRATION_IN_MINUTES,
) {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: objectKey,
  });
  return getSignedUrl(s3Client, command, {
    expiresIn: presignedUrlExpirationInMinutes * 60,
  });
}
