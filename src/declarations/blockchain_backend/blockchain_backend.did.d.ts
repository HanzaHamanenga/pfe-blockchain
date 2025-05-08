import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Document {
  'id' : string,
  'contentHash' : string,
  'metadata' : Metadata,
  'createdAt' : bigint,
  'createdBy' : Principal,
  'ipfsCid' : string,
}
export interface Metadata {
  'ownerEmail' : string,
  'universityName' : string,
  'ownerName' : string,
  'year' : string,
  'fileName' : string,
  'fileSize' : bigint,
  'fileType' : string,
  'category' : string,
  'fieldOfStudy' : string,
  'fileUrl' : string,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export interface _SERVICE {
  'addAdmin' : ActorMethod<[Principal], boolean>,
  'getAllDocuments' : ActorMethod<[], Array<Document>>,
  'getDocument' : ActorMethod<[string], [] | [Document]>,
  'registerDocument' : ActorMethod<[string, string, Metadata], Result>,
  'verifyDocument' : ActorMethod<[string], Array<Document>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
