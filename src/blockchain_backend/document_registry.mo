import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Nat "mo:base/Nat";

actor DocumentRegistry {
  public type Metadata = {
    category : Text;
    year : Text;
    ownerName : Text;
    ownerEmail : Text;
    universityName : Text;
    fieldOfStudy : Text;
    fileName : Text;
    fileType : Text;
  };

  public type Document = {
    id : Text;
    contentHash : Text;
    metadata : Metadata;
    createdAt : Int;
    createdBy : Principal;
  };

  private stable var documentsEntries : [(Text, Document)] = [];
  private stable var admins : [Principal] = [
    Principal.fromText("rt4ab-jozwg-iqwj3-nyy6z-qaoil-piebd-m6ptu-4cz6t-ceg5c-btn44-dqe"),
    Principal.fromText("2joxi-nzcdb-apeza-nl7dj-f64pd-sfb77-7rtfj-mpiom-oaoo2-m7kv4-6qe"),
    Principal.fromText("glskx-tj2s5-zhpc2-b5i3b-hxiyo-apavv-v7axd-4ww4l-x4w3p-w47ha-6ae")
  ];

  private var documents = HashMap.HashMap<Text, Document>(
    0,
    Text.equal,
    Text.hash,
  );

  system func preupgrade() {
    documentsEntries := Iter.toArray(documents.entries());
  };

  system func postupgrade() {
    documents := HashMap.fromIter<Text, Document>(
      documentsEntries.vals(),
      0,
      Text.equal,
      Text.hash,
    );
    documentsEntries := [];
  };

  public shared ({ caller }) func registerDocument(
    contentHash : Text,
    metadata : Metadata,
  ) : async Result.Result<Text, Text> {
    if (not isAdmin(caller)) {
      return #err("Unauthorized: Only admins can register documents");
    };

    // Validate content hash
    if (contentHash.size() != 64) {
      return #err("Invalid content hash");
    };

    let docId = "doc-" # Nat.toText(Int.abs(Time.now()));
    let doc : Document = {
      id = docId;
      contentHash;
      metadata;
      createdAt = Time.now();
      createdBy = caller;
    };

    documents.put(docId, doc);
    #ok(docId);
  };

  public query func getDocument(id : Text) : async ?Document {
    documents.get(id);
  };

  public query func verifyDocument(contentHash : Text) : async [Document] {
    Iter.toArray(
      Iter.filter(
        documents.vals(),
        func(doc : Document) : Bool { doc.contentHash == contentHash },
      )
    );
  };

  public shared query ({ caller }) func getAllDocuments() : async [Document] {
    if (not isAdmin(caller)) return [];
    Iter.toArray(documents.vals());
  };

  // // Admin Management
  // public shared ({ caller }) func addAdmin(newAdmin : Principal) : async Bool {
  //   if (isAdmin(caller)) {
  //     admins := Array.append(admins, [newAdmin]);
  //     true
  //   } else {
  //     false
  //   }
  // };

  public shared ({ caller }) func addAdmin(newAdmin : Principal) : async Bool {
    if (not isAdmin(caller)) return false;

    admins := Array.append(admins, [newAdmin]);
    true;
  };

  public shared query func getAdmins() : async [Principal] {
    admins;
  };
  public query func getAllAdmins() : async [Principal] {
    admins;
  };
  private func isAdmin(p : Principal) : Bool {
    Array.find<Principal>(admins, func(admin) { admin == p }) != null;
  };
};
