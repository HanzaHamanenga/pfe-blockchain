import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Nat "mo:base/Nat"; 
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Array "mo:base/Array"; 
import Time "mo:base/Time";
import Error "mo:base/Error";
import Option "mo:base/Option";
import NFTCanister "canister:NFT"; 
import Int "mo:base/Int";

actor DocumentVerification {

  public type DocMetadata = {
    hash: Text;
    name: Text;
    timestamp: Int;
    owner : Text;
    description: Text;
  };

  private var docHashes = HashMap.HashMap<Text, DocMetadata>(0, Text.equal, Text.hash);

  private stable var stableDocData: [(Text, DocMetadata)] = [];

  stable var admins: [Principal] = [];

  
 public shared ({caller}) func setAdmin() : async Bool {
  
  if (Principal.isAnonymous(caller)) {
    throw Error.reject("Anonymous principal not allowed!!");
  };

  
  if (Array.size(admins) == 0) {
    admins := Array.append(admins, [caller]);
    return true; 
  };

  
  if (not isAdmin(caller)) {
    throw Error.reject("Only an admin can set another admin");
  };

  
  admins := Array.append(admins, [caller]);
  return true;
};

  private func isAdmin(principal: Principal) : Bool {
    switch (Array.find<Principal>(admins, func(x) { x == principal })) {
      case (?found) true;
      case _ false;
    };
  };

 
  public shared ({caller}) func addAdmin(newAdmin : Principal): async Bool {
    if (not isAdmin(caller)) {
      throw Error.reject("Only admin can add new admin");
    };
    admins := Array.append(admins, [newAdmin]);
    return true;
  };

  // Remove admin only if the caller is an admin
  public shared ({caller}) func removeAdmin(oldAdmin : Principal): async Bool {
    if (not isAdmin(caller)) {
      throw Error.reject("Only admin can remove old admin");
    };
    admins := Array.filter<Principal>(admins, func(x) { x != oldAdmin });
    return true;
  };

  
  public shared query ({caller}) func getAdmin() : async [Principal] {
    return admins;
  };

  // Add document hash metadata
  public shared ({caller}) func addDocHash(hash: Text, name: Text, description: ?Text): async Bool {
    if (docHashes.get(hash) != null) {
      throw Error.reject("Document hash already exists.");
    };

    let desc = switch (description) {
      case (?d) d;
      case null "" 
    };

    let metadata: DocMetadata = {
      hash = hash;
      name = name;
      timestamp = Time.now();
      owner = Principal.toText(caller);
      description = desc;
    };

    docHashes.put(hash, metadata);
    return true;
  };

  
  public shared ({caller}) func verifyDocument(hash: Text) : async Text {
    switch (docHashes.get(hash)) {
      case null {
        throw Error.reject("Document not found. Verification failed.");
      };
      case (?doc) {
        let mintResult = await NFTCanister.mintNFT(
          caller,
          "Verified Document NFT",
          "Document: " # doc.name # " | Hash: " # doc.hash,
          doc.hash
        );

        let tokenIdOpt = Nat.fromText(mintResult);
        switch (tokenIdOpt) {
          case null {
            throw Error.reject("Invalid token ID returned from mintNFT");
          };
          case (?tokenId) {
            let tokenOpt = await NFTCanister.getToken(tokenId);
            switch (tokenOpt) {
          case null {
                throw Error.reject("Failed to retrieve minted NFT.");
              };
          case (?token) {
                return " NFT Minted!\n\nToken ID: " # Nat.toText(token.id)
                  # "\nOwner: " # Principal.toText(token.owner)
                  # "\nName: " # token.metadata.name
                  # "\nHash: " # token.metadata.hash
                  # "\nDescription: " # token.metadata.description
                  # "\nMinted At: " # Int.toText(token.metadata.mintedAt);
              };
            };
          };
        };
      };
    };
  };
  
       public func getCanisterPrincipal() : async Principal {
         return Principal.fromActor(DocumentVerification);
   };

 
  public shared query ({caller}) func whoami(): async Text {
    return Principal.toText(caller);
  };
};
