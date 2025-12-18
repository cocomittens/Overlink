import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/login.scss";
import { PasswordBreaker } from "../software/PasswordBreaker";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  currentNodeAtom,
  nodesAtom,
  soundEnabledAtom,
  currentSoftwareAtom,
  traceStateAtom,
} from "../store";
import { useNavigate } from "react-router-dom";
import SavedUserList, { SavedUser } from "../components/SavedUserList";
import { getMapNodes } from "../api";

export default function Login() {
  const [start, setStart] = useState(false);
  const [username, setUsername] = useState("");
  const [passwordMask, setPasswordMask] = useState("");
  const [currentNode] = useAtom(currentNodeAtom);
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [currentSoftware, setCurrentSoftware] = useAtom(currentSoftwareAtom);
  const traceState = useAtomValue(traceStateAtom);
  const setTraceState = useSetAtom(traceStateAtom);
  const [currentNodeData, setCurrentNodeData] = useState<
    (typeof nodes)[0] | undefined
  >(undefined);
  const [isGuessed, setIsGuessed] = useState(false);
  const [savedUsers, setSavedUsers] = useState<SavedUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const prevNodeDataRef = useRef<(typeof nodes)[0] | undefined>(undefined);
  const traceInitializedRef = useRef(false);
  const traceRequestedRef = useRef(false);
  const [soundEnabled] = useAtom(soundEnabledAtom);

  const navigate = useNavigate();
  const getStorageKeys = () =>
    currentNode ? [`savedLogins-${currentNode}`] : ["savedLogins"];

  const loadSavedUsers = (): SavedUser[] => {
    if (typeof localStorage === "undefined") return [];
    const [key] = getStorageKeys();
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      return JSON.parse(raw) as SavedUser[];
    } catch {
      return [];
    }
  };

  const persistSavedUsers = (users: SavedUser[]) => {
    if (typeof localStorage === "undefined") return;
    const primaryKey = currentNode
      ? `savedLogins-${currentNode}`
      : "savedLogins";
    try {
      localStorage.setItem(primaryKey, JSON.stringify(users));
    } catch {
      /* ignore storage errors */
    }
  };

  useEffect(() => {
    setSavedUsers(loadSavedUsers());
  }, [currentNode]);

  const handleTraceSoftware = useCallback(
    (nodeData?: (typeof nodes)[0] | undefined) => {
      // Use provided nodeData or fall back to state (for backward compatibility)
      const nodeDataToUse = nodeData ?? currentNodeData;

      // If node data hasn't loaded yet, preserve existing trace state to avoid race condition
      if (!nodeDataToUse) {
        // Don't modify trace state or software if we don't have node data yet
        // This prevents stopping an active trace during page refresh before nodes load
        // If there's an active trace, preserve it by keeping trace_tracker in software
        if (traceState.active) {
          setCurrentSoftware((prev) => {
            const next = new Set(prev);
            next.add("trace_tracker");
            return next;
          });
        } else {
          // Mark that we've requested trace initialization, so it can be handled when nodes load
          traceRequestedRef.current = true;
        }
        return;
      }

      const hasTrace = Boolean(nodeDataToUse.hasTrace);
      const profileId = nodeDataToUse.traceProfileId || "medium";

      if (hasTrace) {
        setCurrentSoftware((prev) => {
          const next = new Set(prev);
          next.add("trace_tracker");
          return next;
        });
        setTraceState((prev) => {
          // Continue existing trace if active and not complete, preserving progress
          // Update profileId to match new node's profile (trace speed will adjust)
          if (prev.active && prev.progress < 100) {
            return {
              ...prev,
              profileId,
            };
          }
          // Start new trace if none exists or previous one completed
          return {
            active: true,
            progress: 0,
            profileId,
          };
        });
      } else {
        // Node doesn't have a trace, so remove trace_tracker software
        setCurrentSoftware((prev) => {
          const next = new Set(prev);
          next.delete("trace_tracker");
          return next;
        });
        // Stop any active trace since this node doesn't have a trace
        if (traceState.active) {
          setTraceState({ active: false, progress: 0, profileId: null });
        }
      }
    },
    [currentNodeData, traceState.active, setCurrentSoftware, setTraceState]
  );

  useEffect(() => {
    const data = nodes.find((node) => node.id === currentNode);
    const wasUndefined = prevNodeDataRef.current === undefined;
    const nodeChanged = prevNodeDataRef.current?.id !== data?.id;

    if (nodeChanged) {
      traceInitializedRef.current = false;
      traceRequestedRef.current = false;
    }

    prevNodeDataRef.current = data;
    setCurrentNodeData(data);

    // Re-evaluate trace state when currentNodeData becomes available after nodes load
    // This handles the case where handleTraceSoftware was called before nodes loaded
    // Pass data directly to avoid stale closure issue with async state updates
    if (
      wasUndefined &&
      data &&
      !traceInitializedRef.current &&
      (traceState.active ||
        currentSoftware.has("trace_tracker") ||
        traceRequestedRef.current)
    ) {
      traceInitializedRef.current = true;
      traceRequestedRef.current = false;
      handleTraceSoftware(data);
    }
  }, [
    nodes,
    currentNode,
    traceState.active,
    currentSoftware,
    handleTraceSoftware,
  ]);

  useEffect(() => {
    if (nodes.length === 0) {
      getMapNodes()
        .then((data) => setNodes(data || []))
        .catch((err) =>
          console.error("Failed to load map nodes for login", err)
        );
    }
  }, [nodes.length, setNodes]);

  useEffect(() => {
    successSoundRef.current =
      typeof Audio !== "undefined"
        ? new Audio("/soundEffects/login_success.mp3")
        : null;
    if (successSoundRef.current) {
      successSoundRef.current.volume = 0.6;
    }
  }, []);

  const initializeBreaker = () => {
    setUsername("admin");
    setStart(true);
    handleTraceSoftware();
  };

  const handleSavedSelect = (user: SavedUser) => {
    setUsername(user.username);
    setPasswordMask("*".repeat(user.password.length));
    setIsGuessed(true);
    setSelectedUser(user.username);
    setStart(false);
  };

  const upsertSavedUser = () => {
    const usernameToSave =
      username.trim() || currentNodeData?.name || currentNode || "user";
    const passwordToSave =
      currentNodeData?.password ||
      (passwordMask ? passwordMask.replace(/\*/g, "•") : "");
    if (!passwordToSave) return;
    setSavedUsers((prev) => {
      const existingIndex = prev.findIndex(
        (u) => u.username === usernameToSave
      );
      let next: SavedUser[];
      if (existingIndex >= 0) {
        next = [...prev];
        next[existingIndex] = {
          username: usernameToSave,
          password: passwordToSave,
          nodeId: currentNode || undefined,
        };
      } else {
        next = [
          ...prev,
          {
            username: usernameToSave,
            password: passwordToSave,
            nodeId: currentNode || undefined,
          },
        ];
      }
      persistSavedUsers(next);
      setSelectedUser(usernameToSave);
      return next;
    });
  };

  const handleComplete = () => {
    setIsGuessed(true);
    setPasswordMask(
      currentNodeData?.password
        ? "*".repeat(currentNodeData.password.length)
        : ""
    );
  };

  const handleProceed = () => {
    if (isGuessed) {
      upsertSavedUser();
      if (soundEnabled && successSoundRef.current) {
        successSoundRef.current.currentTime = 0;
        successSoundRef.current.play().catch(() => {});
      }
      handleTraceSoftware();
      navigate("/terminal");
    }
  };

  return (
    <>
      <div className="login-page">
        <div className="login-container">
          <h2>{currentNodeData?.name || currentNode}</h2>
          <div className="login-form">
            <h3>User Authorization Required</h3>
            <form>
              <div className="form-group">
                <label htmlFor="username">Name</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Code</label>
                <input
                  type="text"
                  id="password"
                  name="password"
                  required
                  onClick={initializeBreaker}
                  value={passwordMask}
                  readOnly
                />
              </div>
            </form>
          </div>
          <button
            type="submit"
            className={`login-button ${!isGuessed && "disabled"}`}
            onClick={handleProceed}
          >
            Proceed
          </button>
        </div>
        <SavedUserList
          users={savedUsers}
          onSelect={handleSavedSelect}
          selectedUsername={selectedUser}
        />
      </div>
      {currentSoftware.has("password_breaker") && (
        <PasswordBreaker
          password={currentNodeData?.password || null}
          start={start}
          onComplete={handleComplete}
          soundEnabled={soundEnabled}
          onClose={() =>
            setCurrentSoftware((prev) => {
              const next = new Set(prev);
              next.delete("password_breaker");
              return next;
            })
          }
        />
      )}
    </>
  );
}
