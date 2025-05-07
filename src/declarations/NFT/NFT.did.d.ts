import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Metadata {
  'hash' : string,
  'name' : string,
  'description' : string,
  'mintedAt' : bigint,
}
export interface Token {
  'id' : bigint,
  'owner' : Principal,
  'metadata' : Metadata,
}
export interface _SERVICE {
  'getMinter' : ActorMethod<[], Principal>,
  'getToken' : ActorMethod<[bigint], [] | [Token]>,
  'getTokensByOwner' : ActorMethod<[Principal], Array<Token>>,
  'init' : ActorMethod<[Principal], boolean>,
  'mintNFT' : ActorMethod<[Principal, string, string, string], string>,
  'setMinter' : ActorMethod<[Principal], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
