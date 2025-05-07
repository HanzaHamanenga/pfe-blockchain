import React, { useState, useEffect } from 'react';
import { AuthClient } from "@dfinity/auth-client";
import { Actor, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { idlFactory } from "../../../declarations/blockchain_backend";
import { CANISTER_IDS } from "../config";
import './Admin.css';


const TTL = BigInt(24 * 60 * 60 * 1_000_000_000);

 const HOST = window.location.host.includes('localhost') 
  ? "http://localhost:4943" 
  : "https://ic0.app";

 const AUTH_CONFIG = {
  identityProvider: process.env.DFX_NETWORK === "ic"
    ? "https://identity.ic0.app/#authorize"
    : `http://${CANISTER_IDS.II}.localhost:4943/` 
};

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authClient, setAuthClient] = useState(null);
  const [identity, setIdentity] = useState(null);
  const [principal, setPrincipal] = useState("");
  const [actor, setActor] = useState(null);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [description, setDescription] = useState("");
  const [newAdminPrincipal, setNewAdminPrincipal] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const client = await AuthClient.create({ idleOptions: { disableIdle: true } });
        setAuthClient(client);
        if (await client.isAuthenticated()) {
          await handleAuthenticated(client);
        }
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setInitializing(false);
      }
    };
    init();
  }, []);

  const handleAuthenticated = async (authClient) => {
    try {
      const identity = authClient.getIdentity();
      setIdentity(identity);
      
      const principal = identity.getPrincipal();
      const principalText = principal.toString();
      setPrincipal(principalText);
      setIsAuthenticated(true);

      const agent = new HttpAgent({
        identity,
        host: HOST,
      });
      
      if (window.location.host.includes("localhost")) {
        try {
          await agent.fetchRootKey(); 
          console.log(" Fetched root key");
        } catch (err) {
          console.warn(" Could not fetch root key:", err);
        }
      }
      
     

      const actor = Actor.createActor(idlFactory, {
        agent,
        canisterId: CANISTER_IDS.BLOCKCHAIN_BACKEND
      });
      setActor(actor);

      await checkAdminStatus(actor, principalText);

    } catch (error) {
      console.error("Authentication failed:", error);
      setMessage(`Error: ${extractErrorMessage(error)}`);
      await handleLogout();
    }
  };

  const checkAdminStatus = async (actor, principalText) => {
    try {
      const admins = await actor.getAdmin();
  
      const isUserAdmin = admins.some(admin => admin.toText() === principalText);
      setIsAdmin(isUserAdmin);
  
      if (!isUserAdmin) {
        
        try {
          const result = await actor.setAdmin();
          if (result === true) {
            setIsAdmin(true);
            setMessage("You have been assigned as the first admin.");
            return;
          } else {
            setMessage("You don't have admin privileges");
          }
        } catch (error) {
          
          console.log("setAdmin failed:", error.message);
          setMessage("You don't have admin privileges");
        }
      }
    } catch (error) {
      console.error("Admin check failed:", error);
      setMessage("Failed to verify admin status");
      setIsAdmin(false);
    }
  };
  

  const handleBecomeAdmin = async () => {
    if (!actor) {
      setMessage("Something went wrong. Please try again later.");
      return;
    }
  
    setLoading(true);
    try {
      const result = await actor.setAdmin();
      if (result === true) {
        await checkAdminStatus(actor, principal);
        setMessage("You are now an admin!");
      } else {
        setMessage("You are not authorized to perform this action.");
      }
    } catch (error) {
      console.warn("Unauthorized admin attempt:", error.message);
      setMessage("Only the first user can become an admin, or you may not have access.");
    } finally {
      setLoading(false);
    }
  };
  

  const extractErrorMessage = (error) => {
    if (error.message.includes("Body:")) {
      return error.message.split("Body:")[1].split("\n")[0];
    }
    return error.message;
  };

  const login = async () => {
    if (!authClient) {
      setMessage("Auth client not initialized");
      return;
    }
  
    setLoading(true);
    try {
      await authClient.login({
        identityProvider: AUTH_CONFIG.identityProvider,
        maxTimeToLive: TTL,
        onSuccess: () => {
          handleAuthenticated(authClient); 
          setLoading(false); 
        },

        onError: (error) => {
          setMessage(`Login failed: ${extractErrorMessage(error)}`);
          setLoading(false);
        }
      });
      
    } catch (error) {
      setMessage(`Login error: ${extractErrorMessage(error)}`);
      setLoading(false);
    }
  };
  
  const logout = async () => {
    if (!authClient) return;

    await authClient.logout();
    setIsAuthenticated(false);
    setIdentity(null);
    setPrincipal("");
    setActor(null);
    setIsAdmin(false);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const uploadDocument = async () => {
    if (!actor || !file) return;
  
    setLoading(true);
    setMessage("");
  
    try {
      const fileBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", fileBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  
      
      const optDescription = description?.trim() ? [description.trim()] : [];
  
      const result = await actor.addDocHash(hashHex, fileName, optDescription);
  
      if (result) {
        setMessage(`Document "${fileName}" successfully added to blockchain!`);
        setFile(null);
        setFileName("");
        setDescription("");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      setMessage(`Error uploading document: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  

  const transferAdmin = async () => {
    if (!actor || !newAdminPrincipal) return;
  
    setLoading(true);
    setMessage("");
  
    try {
      const cleanInput = newAdminPrincipal
        .trim() 
        .replace(/\s+/g, "") 
        .replace(/[^\x21-\x7E]+/g, ""); 
  
      const principal = Principal.fromText(cleanInput); 
      const result = await actor.addAdmin(principal);
  
      if (result) {
        setMessage(`Admin privileges granted to ${cleanInput}`);
        setNewAdminPrincipal("");
      } else {
        setMessage("Failed to grant admin privileges. Backend returned false.");
      }
    } catch (error) {
      console.error("Error transferring admin:", error);
      setMessage("Error: Invalid Principal ID. Please double-check and try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>

      {!isAuthenticated ? (
        <div className="login-section">
          <p>Please login to access admin features</p>
          <button onClick={login} disabled={loading}>
            {loading ? "Processing..." : "Login with Internet Identity"}
          </button>
        </div>
      ) : (
        <div className="admin-dashboard">
          <div className="admin-info">
            <h2>Your Principal:</h2>
            <p className="principal-id">{principal}</p>
            <p className="admin-status">
              {isAdmin ? " Admin" : " Not Admin"}
            </p>
            <button onClick={logout} disabled={loading}>Logout</button>
          </div>

          <div className="admin-actions">
            {!isAdmin && (
              <button onClick={handleBecomeAdmin} disabled={loading}>
                {loading ? "Processing..." : "Become Admin"}
              </button>
            )}

            {isAdmin && (
              <>
                <div className="upload-section">
                  <h2>Upload Document</h2>
                  <input type="file" onChange={handleFileChange} disabled={loading} />
                  {file && (
                    <>
                      <textarea
                        placeholder="Document description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                      />
                      <button onClick={uploadDocument} disabled={loading}>
                        {loading ? "Uploading..." : "Upload Document"}
                      </button>
                    </>
                  )}
                </div>

                <div className="transfer-section">
                  <h2>Grant Admin Privileges</h2>
                  <input
                    type="text"
                    placeholder="Enter principal ID"
                    value={newAdminPrincipal}
                    onChange={(e) => setNewAdminPrincipal(e.target.value)}
                    disabled={loading}
                  />
                  <button onClick={transferAdmin} disabled={loading || !newAdminPrincipal}>
                    {loading ? "Processing..." : "Grant Admin Access"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {message && (
        <div className="message-box">
          <p>{message}</p>
          <button onClick={() => setMessage("")}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Admin;
