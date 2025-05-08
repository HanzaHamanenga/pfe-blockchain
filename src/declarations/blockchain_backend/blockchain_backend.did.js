export const idlFactory = ({ IDL }) => {
  const Metadata = IDL.Record({
    'ownerEmail' : IDL.Text,
    'universityName' : IDL.Text,
    'ownerName' : IDL.Text,
    'year' : IDL.Text,
    'fileName' : IDL.Text,
    'fileSize' : IDL.Nat,
    'fileType' : IDL.Text,
    'category' : IDL.Text,
    'fieldOfStudy' : IDL.Text,
    'fileUrl' : IDL.Text,
  });
  const Document = IDL.Record({
    'id' : IDL.Text,
    'contentHash' : IDL.Text,
    'metadata' : Metadata,
    'createdAt' : IDL.Int,
    'createdBy' : IDL.Principal,
    'ipfsCid' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'addAdmin' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'getAllDocuments' : IDL.Func([], [IDL.Vec(Document)], ['query']),
    'getDocument' : IDL.Func([IDL.Text], [IDL.Opt(Document)], ['query']),
    'registerDocument' : IDL.Func([IDL.Text, IDL.Text, Metadata], [Result], []),
    'verifyDocument' : IDL.Func([IDL.Text], [IDL.Vec(Document)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
