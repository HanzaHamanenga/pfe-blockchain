export const idlFactory = ({ IDL }) => {
  const Metadata = IDL.Record({
    'hash' : IDL.Text,
    'name' : IDL.Text,
    'description' : IDL.Text,
    'mintedAt' : IDL.Int,
  });
  const Token = IDL.Record({
    'id' : IDL.Nat,
    'owner' : IDL.Principal,
    'metadata' : Metadata,
  });
  return IDL.Service({
    'getMinter' : IDL.Func([], [IDL.Principal], ['query']),
    'getToken' : IDL.Func([IDL.Nat], [IDL.Opt(Token)], ['query']),
    'getTokensByOwner' : IDL.Func([IDL.Principal], [IDL.Vec(Token)], ['query']),
    'init' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'mintNFT' : IDL.Func(
        [IDL.Principal, IDL.Text, IDL.Text, IDL.Text],
        [IDL.Text],
        [],
      ),
    'setMinter' : IDL.Func([IDL.Principal], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
