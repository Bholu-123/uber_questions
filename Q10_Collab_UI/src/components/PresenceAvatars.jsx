export function PresenceAvatars({ presence }) {
  return (
    <div className="presence-bar">
      {Object.values(presence).map((user) => (
        <div
          key={user.id}
          className="avatar"
          style={{ background: user.color }}
          title={user.name}
        >
          {user.name[0]}
          <span className="avatar-status" />
        </div>
      ))}
    </div>
  );
}
