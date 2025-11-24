import React from "react";

export type SavedUser = {
  username: string;
  password: string;
};

type SavedUserListProps = {
  users: SavedUser[];
  onSelect: (user: SavedUser) => void;
  selectedUsername: string | null;
};

const SavedUserList: React.FC<SavedUserListProps> = ({
  users,
  onSelect,
  selectedUsername,
}) => {
  return (
    <div className="saved-user-list">
      <h3>Saved Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user.username}>
            <button
              type="button"
              className={`saved-user-button${
                selectedUsername === user.username ? " active" : ""
              }`}
              onClick={() => onSelect(user)}
            >
              {user.username}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedUserList;
