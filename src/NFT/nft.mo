import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Error "mo:base/Error";
import Array "mo:base/Array";  
import Nat "mo:base/Nat";      

actor NFTCanister {
  public type Metadata = {
    name: Text;
    description: Text;
    mintedAt: Int;
    hash: Text; 
  };

  public type Token = {
    id: Nat;
    owner: Principal;
    metadata: Metadata;
  };
  
  private stable var tokens : [Token] = [];
  private stable var tokenCounter : Nat = 0;
  private stable var minter : Principal = Principal.fromText("2vxsx-fae");
  
  public shared({caller}) func init(initialMinter: Principal): async Bool {
    if (minter != Principal.fromText("2vxsx-fae") and caller != minter) {
      throw Error.reject("Only the current minter can re-initialize");
    };
    
    minter := initialMinter;
    return true;
  };

  public shared ({caller}) func mintNFT(to: Principal, name: Text, description: Text, hash: Text): async Text {
    if (caller != minter) {
      throw Error.reject("Only the minter (main canister) can mint NFTs.");
    };

    let metadata: Metadata = {
      name = name;
      description = description;
      mintedAt = Time.now();
      hash = hash; 
    };

    let token: Token = {
      id = tokenCounter;
      owner = to;
      metadata = metadata;
    };

    tokens := Array.append(tokens, [token]);
    tokenCounter += 1;

    return Nat.toText(token.id);
  };
  
  public query func getToken(tokenId: Nat): async ?Token {
    if (tokenId >= tokens.size()) return null;
    return ?tokens[tokenId];
  };

  public query func getTokensByOwner(owner: Principal): async [Token] {
    return Array.filter<Token>(tokens, func(t) { t.owner == owner });
  };

  public shared ({caller}) func setMinter(newMinter: Principal): async Bool {
    if (caller != minter) {
      throw Error.reject("Only current minter can change the minter.");
    };
    minter := newMinter;
    return true;
  };
  
  public query func getMinter(): async Principal {
    return minter;
  };
}