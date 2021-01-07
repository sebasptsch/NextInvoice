export default function SignOut({ csrfToken }) {
  return (
    <div className="signout">
      <h1>Are you sure you want to sign out?</h1>
      <form action={`/api/auth/signout`} method="POST">
        <input type="hidden" name="csrfToken" value={csrfToken} />
        <button type="submit">Sign out</button>
      </form>
    </div>
  );
}
