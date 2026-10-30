# MediBook: roles and local setup

1. In the root directory: `npm install`, `npm run dev`.
2. In `server`: `npm install`, create `.env` with `JWT_SECRET` (at least 32 random characters), `PORT=3001`, then `npm run dev`.
3. In root `.env.local`: `VITE_API_URL=http://localhost:3001`.
4. Admin login opens `/dashboard`, patient login opens `/`, doctor login opens `/doctor-dashboard`.
5. To create a doctor login, register a separate account using the normal registration form, then log in as admin and use the **Doctor account linking** section: select an existing doctor and enter the newly registered email. Log out and log in with that email to refresh the role.
6. The admin patients count comes from `users` where `role='patient'`. Converting a patient to doctor reduces the patient count by one.
7. Patient names shown in appointments are read from `users.name` of the account that booked. If a user registered as “Test Patient”, that name is the saved account name. Create a new patient account with a real name to see it in future appointments; existing names are not guessed or replaced.
8. The ZIP deliberately excludes `.git`, `node_modules`, `.env`, `.env.local` and SQLite databases. **Keep your existing `server/medibook.db`** when copying files into your local project. Database schema is backward-compatible.
9. This is a local backend. GitHub Pages alone cannot serve `/api/*` from your computer. Deploy the backend and configure `VITE_API_URL` to use it for public functionality.
