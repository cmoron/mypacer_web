# Running Pace Table

## Overview
The Running Pace Table is a Svelte-based web application designed to display a dynamic table of running paces. It interacts with a FastAPI backend service to retrieve and display data based on the user's input. The application allows users to select minimum and maximum paces, as well as the increment value, and displays a table of calculated paces for various running distances.

## Features
- Interactive table to display running paces
- User input for minimum pace, maximum pace, and increment
- Dynamic data fetching from a FastAPI backend
- Responsive design for desktop and mobile view

## Getting Started
To get a local copy up and running, follow these simple steps.

### Prerequisites
- Ensure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/cmoron/running_pace_table.git
   ```
2. Navigate to the project directory:
   ```sh
   cd running_pace_table
   ```
3. Install NPM packages:
   ```sh
   npm install
   ```
4. Run the application in development mode:
   ```sh
   npm run dev
   ```
   This will start the application on `localhost:3000` (or another port if 3000 is busy).

## Usage
Use the application to calculate and view running paces. Select the desired minimum pace, maximum pace, and increment to view the table of paces for different distances.

## Deployment
For deployment, build the static files and host them on any static file server or service like Netlify, Vercel, or GitHub Pages.

Run the build command:
```sh
npm run build
```
This command generates static files in the `public` folder which can be deployed.

## Docker & CI/CD

- Image multi-stage disponible via `Dockerfile` (build arg `VITE_API_URL`, défaut `https://api.mypacer.fr`).
  ```sh
  docker build --target prod -t mypacer_web:latest-prod --build-arg VITE_API_URL=https://api.mypacer.fr .
  ```
- CI (`.github/workflows/ci.yml`) : `npm ci`, lint, build sur chaque push/PR.
- Publication d'image GHCR (`.github/workflows/docker.yml`) vers `ghcr.io/cmoron/mypacer_web:latest-prod` + tags semver/sha.

### Testing the Production Image Locally
To verify that the production Docker image works correctly before deployment, you can follow these steps:

1.  **Build the production image locally:**
    From the `mypacer_web` directory, run the build command. Let's give it a temporary tag like `test-web-prod`.
    ```bash
    docker build -t test-web-prod .
    ```

2.  **Run a container from the image:**
    This command starts a container in the background and maps port 8080 on your host to port 80 inside the container (where Nginx is listening).
    ```bash
    docker run -d --name test-web-container -p 8080:80 test-web-prod
    ```

3.  **Verify in your browser:**
    Open `http://localhost:8080` in your web browser. The application should load and be fully functional.

4.  **Clean up:**
    Once you've finished testing, stop and remove the temporary container.
    ```bash
    docker stop test-web-container
    docker rm test-web-container
    ```

## Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Acknowledgements
- [Svelte](https://svelte.dev/)
- [Vite](https://vitejs.dev/)
