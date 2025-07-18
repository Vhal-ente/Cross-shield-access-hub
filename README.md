# Welcome to CROSS SHIELD ACCESS HUB

## Project info

Cross Shield connects community pharmacies, suppliers, and patients to ensure reliable access to essential medicines—even in hard-to-reach areas.

## 🔗 Live Preview

👉 [Click here to view the live site](https://Vhal-ente.github.io/Cross-shield-access-hub)


**Cloning this project**

If you want to work locally, you can clone this repo and and edit it locally on your device.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Install frontend dependencies
npm install

# Step 2: Set up backend
cd cross_shield_backend
npm install

# Step 3: Set up your MySQL database
# Create a database named 'cross_shield' in MySQL Workbench
# Update the .env file with your MySQL credentials

# Step 4: Set up the backend
cd cross_shield_backend
npm i
cp .env.example .env
node ace migration:run
node ace db:seed
npm run dev

# Step 5: In a new terminal, start the frontend
# Step 4: Run database migrations and seed data
node ace migration:run
node ace db:seed

# Step 5: Start the backend server
npm run dev

# Step 6: In a new terminal, start the frontend (from root directory)
cd ..
npm run dev
```


## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


