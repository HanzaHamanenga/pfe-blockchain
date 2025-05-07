export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addAdmin' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'addDocHash' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Opt(IDL.Text)],
        [IDL.Bool],
        [],
      ),
    'getAdmin' : IDL.Func([], [IDL.Vec(IDL.Principal)], ['query']),
    'getCanisterPrincipal' : IDL.Func([], [IDL.Principal], []),
    'removeAdmin' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'setAdmin' : IDL.Func([], [IDL.Bool], []),
    'verifyDocument' : IDL.Func([IDL.Text], [IDL.Text], []),
    'whoami' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
