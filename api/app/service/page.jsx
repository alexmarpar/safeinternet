export default async function UsersPage() {
  const res = await fetch("http://localhost:3000/api/users", {
    cache: "no-store",
  });

  const users = await res.json();

  return (
    <div>
      <h1>Usuarios</h1>
      {users.map((u) => (
        <p key={u._id}>{u.name}</p>
      ))}
    </div>
  );
}
