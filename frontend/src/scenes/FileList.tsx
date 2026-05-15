import "../styles/terminal.scss";
import { useAtom, useSetAtom } from "jotai";
import {
  currentNodeAtom,
  currentSoftwareAtom,
  directoryAtom,
  selectedFileAtom,
  Directory,
  deletedServerFilesAtom,
  traceStateAtom,
} from "../store";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";

export default function FileList() {
  const [directory, setDirectory] = useAtom(directoryAtom);
  const [currentSoftware] = useAtom(currentSoftwareAtom);
  const [, setSelectedFile] = useAtom(selectedFileAtom);
  const deletedServerFiles = useAtomValue(deletedServerFilesAtom);
  const setCurrentNode = useSetAtom(currentNodeAtom);
  const setTraceState = useSetAtom(traceStateAtom);
  const setCurrentSoftware = useSetAtom(currentSoftwareAtom);
  const navigate = useNavigate();

  const handleBack = () => {
    const prev = sessionStorage.getItem("prevComputerPath");
    if (prev && prev !== "/login" && prev !== "/agentLogin") {
      navigate(prev);
    } else {
      navigate("/");
    }
  };

  const handleDisconnect = () => {
    setCurrentNode(null);
    setDirectory({ id: "", name: "", data: [] });
    setTraceState({ active: false, progress: 0, profileId: null });
    setCurrentSoftware((prev) => {
      const next = new Set(prev);
      next.delete("trace_tracker");
      return next;
    });
    sessionStorage.setItem("prevComputerPath", "/");
    sessionStorage.setItem("lastComputerPath", "/");
    navigate("/");
  };

  const handleFolderClick = (folder: Directory) => {
    setDirectory(folder);
  };

  return (
    <div className="files-container">
      <div className="icon-row">
        <button
          type="button"
          className="icon-button violet"
          aria-label="Go back"
          onClick={handleBack}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <button
          type="button"
          className="icon-button cyan"
          aria-label="Disconnect"
          onClick={handleDisconnect}
        >
          <span className="material-symbols-outlined">power_settings_new</span>
        </button>
      </div>
      <h2>{directory.name}</h2>
      {directory.folders && directory.folders.length > 0 && (
        <div className="folder-list">
          {directory.folders.map((folder) => (
            <div
              key={folder.id}
              className="folder"
              onClick={() => handleFolderClick(folder)}
            >
              <a className="folder-name">{folder.name}</a>
            </div>
          ))}
        </div>
      )}
      {directory.data && directory.data.length > 0 && (
        <table>
          <thead>
            <tr>
              {directory.data?.map((col, index) => (
                <th key={index}>{col.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {directory.data &&
              directory.data.length > 0 &&
              Array.from({ length: directory.data[0].data.length }).map(
                (_, rowIndex) => {
                  const fileName =
                    directory.data[0]?.data[rowIndex] ?? `file-${rowIndex}`;
                  const isDeleted = deletedServerFiles.some(
                    (entry) =>
                      entry.location === directory.name &&
                      entry.name === fileName
                  );
                  return (
                    <tr
                      key={rowIndex}
                      data-file-name={fileName}
                      data-location={directory.name}
                      onClick={() => {
                        if (!currentSoftware.has("file_copier")) return;
                        setSelectedFile({
                          name: fileName,
                          location: directory.name,
                        });
                      }}
                    >
                      {directory.data.map((col, colIndex) => (
                        <td key={colIndex}>
                          {isDeleted ? "- DELETED -" : col.data[rowIndex]}
                        </td>
                      ))}
                    </tr>
                  );
                }
              )}
          </tbody>
        </table>
      )}
    </div>
  );
}
