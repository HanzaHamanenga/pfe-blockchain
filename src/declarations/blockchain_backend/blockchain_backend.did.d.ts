import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'addAdmin' : ActorMethod<[Principal], boolean>,
  'addDocHash' : ActorMethod<[string, string, [] | [string]], boolean>,
  'getAdmin' : ActorMethod<[], Array<Principal>>,
  'getCanisterPrincipal' : ActorMethod<[], Principal>,
  'removeAdmin' : ActorMethod<[Principal], boolean>,
  'setAdmin' : ActorMethod<[], boolean>,
  'verifyDocument' : ActorMethod<[string], string>,
  'whoami' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
