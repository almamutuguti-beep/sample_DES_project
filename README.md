# sample_DES_project
This is a sample des project that contains the app.js, server.js and style.css files



# Demio Spare Parts Inventory System

A small web app for managing a spare parts inventory. A Node.js/Express server connects to a MySQL database (`demio_spareparts`) and serves a browser front end for logging in and managing records.

Project folder: `dataEnterpriseSystem/sample_DES_project`

---

## Current status

| Area | Status |
|---|---|
| Express server (`server.js`) | Written. Starts and listens on port 3000. |
| MySQL connection | **Not working yet.** Fails with `Access denied for user 'root'@'localhost'`. |
| Login route (`POST /api/login`) | Written. Untested until the database connects. |
| Login page and forgot-password toggle | Written in `app.js`. |
| Dashboard and update pages | Referenced by the code (`dashboard.html`, `update.html`). |
| Dynamic update form | Written, but never called (see Known issues). |
| Delete action | Skeleton only. Shows an alert and does not touch the database. |
| Styling (`style.css`) | Written. One hover bug (see Known issues). |

---

## What is in the project

| File | Role |
|---|---|
| `server.js` | Node/Express backend. Serves the front-end files, parses JSON, connects to MySQL, and handles `POST /api/login` by checking `Username` and `Password` against the `Users` table. |
| `app.js` | Browser script loaded by the HTML pages. Handles the login/forgot-password toggle, sends login requests to `/api/login`, redirects to `update.html?table=<name>`, generates update forms from a schema map, and holds the delete-confirmation skeleton. **Not run with Node.** |
| `style.css` | Layout and styling: centered card container, forms, buttons, and dashboard table cards. |
| `index.html`, `dashboard.html`, `update.html` | Front-end pages referenced by the code. |

### Database tables the front end expects

| Table | Columns |
|---|---|
| `Categories` | `CategoryID`, `CategoryName` |
| `Suppliers` | `SupplierID`, `SupplierName`, `ContactPhone` |
| `Parts` | `PartID`, `PartName`, `PartNumber`, `UnitPrice`, `CategoryID`, `SupplierID` |
| `Inventory` | `InventoryID`, `PartID`, `QuantityInStock`, `LastRestockDate` |
| `Users` | `Username`, `Password` (used by the login route) |

---

## Setup and run

### 1. Prerequisites

- Node.js (v18 or newer)
- MySQL Server, running locally
- VS Code (or any editor)

### 2. Install dependencies

Open the VS Code terminal (`` Ctrl+` ``) in the project folder and run:

```bash
npm init -y
npm install express mysql2 cors dotenv
```

`npm init -y` is only needed once, to create `package.json`.

### 3. Configure the database password

Do not hardcode the password in `server.js`. Create a file named `.env` in the project folder:

```
DB_PASSWORD=your_mysql_password
```

Then in `server.js`, add this as the very first line:

```javascript
require('dotenv').config();
```

and change the connection settings to:

```javascript
password: process.env.DB_PASSWORD,
```

Create a `.gitignore` file so secrets and packages are never committed:

```
node_modules/
.env
```

### 4. Prepare the database

Log in to MySQL and confirm the database and a test user exist:

```sql
SHOW DATABASES;              -- demio_spareparts should be listed
USE demio_spareparts;
INSERT INTO Users (Username, Password) VALUES ('admin', 'test123');
```

If your `Users` table has other required columns, the insert will tell you which.

### 5. Start the server

```bash
node server.js
```

A healthy start prints both lines:

```
Server running at http://localhost:3000
Connected to MySQL Database: demio_spareparts
```

### 6. Open the app

Browse to `http://localhost:3000/`. Do not double-click the HTML files. Opening them as `file://` breaks the `/api/login` request because no server is behind it.

Stop the server with `Ctrl+C`.

---

## Troubleshooting

| Symptom | Cause and fix |
|---|---|
| `Cannot find module 'express'` | Dependencies not installed. Run `npm install express mysql2 cors dotenv` in the project folder. |
| `Access denied for user 'root'@'localhost'` | MySQL is running but rejected the credentials. Test with `mysql -u root -p`. If that works, use exactly that password in `.env`. If it fails, reset the root password. |
| `mysql` is not recognized in the terminal | MySQL's `bin` folder is not on PATH. Use the "MySQL Command Line Client" from the Start menu instead. |
| `Unknown database 'demio_spareparts'` | The database does not exist. Create it and import your tables. |
| "Server error. Ensure Node server is running." alert | The server is down or the page was opened via `file://`. Start the server and use `http://localhost:3000/`. |
| Pages load with no styling | The `<link>` filename does not match. The file is `style.css`, and a stray `styles.css` reference gives a 404. |
| `document is not defined` | `app.js` was run with Node. It is a browser script and must only be loaded by an HTML page. |

Optional dedicated database user, instead of using `root`:

```sql
CREATE USER 'demio_app'@'localhost' IDENTIFIED BY 'a_new_password';
GRANT ALL PRIVILEGES ON demio_spareparts.* TO 'demio_app'@'localhost';
FLUSH PRIVILEGES;
```

---

## Known issues to fix

- [ ] **`app.js` syntax error:** the final line of `loadUpdateForm` ends with `}, `. Change it to `}`. Until fixed, the browser refuses to run the whole file, including login.
- [ ] **`loadUpdateForm` is never called.** Add at the bottom of `app.js`:
  ```javascript
  document.addEventListener('DOMContentLoaded', loadUpdateForm);
  ```
- [ ] **Hardcoded database password** in `server.js`. Move it to `.env` (step 3). Change the MySQL password itself if it was ever shared or committed.
- [ ] **Plain-text passwords.** The login query compares raw passwords. Hash them with `bcrypt` (`bcrypt.compare()` at login).
- [ ] **`express.static(__dirname)` exposes every file in the folder**, including `server.js`. Move front-end files into a `public/` folder and serve `path.join(__dirname, 'public')`.
- [ ] **`.link-btn:hover` bug** in `style.css`. The generic `button:hover` rule turns the "Forgot Password" link's background blue. Add:
  ```css
  .link-btn:hover {
      background: none;
      color: #0056b3;
  }
  ```
- [ ] **Mobile layout.** Add `padding: 20px;` to `body`, and `flex-wrap: wrap; gap: 10px;` to `.table-card`.
- [ ] **Database failure is silent.** If the connection fails, the server keeps running and login returns HTTP 500. Consider exiting on failure.

---

## Next steps

1. Get the database connection working (Troubleshooting above).
2. Apply the Known issues checklist.
3. Test login end to end with a test user.
4. Add real routes for update and delete, replacing the `deleteTableRecord` skeleton.
5. Add password hashing before any real data goes in.