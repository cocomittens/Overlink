import React from "react";

export type SavedUser = {
  username: string;
  password: string;
};

type SavedUserListProps = {
  users: SavedUser[];
  onSelect: (user: SavedUser) => void;
  selectedUsername: string | null;
  usernameOnly?: boolean;
};

const SavedUserList: React.FC<SavedUserListProps> = ({
  users,
  onSelect,
  selectedUsername,
  usernameOnly = false,
}) => {
  const displayUsers = users.slice(0, 5);

  return (
    <div className="saved-user-list">
      <h3>Saved Logins</h3>
      <ul>
        {displayUsers.map((user) => (
          <li key={user.username}>
            <button
              type="button"
              className={`saved-user-button${
                selectedUsername === user.username ? " active" : ""
              }`}
              onClick={() => onSelect(user)}
            >
              {usernameOnly
                ? user.username
                : `Username: ${user.username} Password: ${user.password}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedUserList;
