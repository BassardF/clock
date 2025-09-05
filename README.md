# Breathwork Timer App

## Project Goal

This application aims to provide a customizable breathwork training tool. Users can configure their session parameters on a dedicated setup page, and then proceed to a training page featuring a visual, circular timer that guides them through each breath cycle.

## Features

### 1. Configuration Page

This is the initial page where users define their breathwork session. It will include:

*   **Total Training Time:** An input field to set the overall duration of the breathwork session.
*   **Breath Part Timings:** Four distinct input fields to set the duration for each segment of a single breath cycle:
    *   **Inhale (In):** Time for inhaling.
    *   **Hold (Full with Air):** Time to hold breath after inhaling.
    *   **Exhale (Out):** Time for exhaling.
    *   **Hold (Empty without Air):** Time to hold breath after exhaling.
*   **Start Button:** A button that, when pressed, validates the inputs and navigates the user to the Training Page to begin the session.

### 2. Training Page

This page displays the active breathwork session with a visual timer:

*   **Circular Timer:** A prominent circular timer representing one complete breath cycle. This circle will be dynamically divided into four segments, visually corresponding to the 'In', 'Full', 'Out', and 'Empty' breath parts configured on the previous page.
*   **Real-time Progress:** The timer will animate to show progress through the current breath part and the overall cycle.
*   **Cycle Repetition:** The timer will repeat for the duration of the 'Total Training Time' set on the Configuration Page.

## Getting Started

Follow these steps to set up and run the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/BassardF/clock.git
    cd clock
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the application:**
    ```bash
    npm start
    ```
    The application will open in your default browser at `http://localhost:3000`.

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions. Any push to the `main` branch will trigger a build and deployment.

Your application will be accessible at: `https://BassardF.github.io/clock`

### Troubleshooting Deployment

If your GitHub Pages site is not appearing or showing a 404 error after a successful GitHub Actions build, ensure the following in your repository settings:

1.  Navigate to your repository on GitHub (e.g., `https://github.com/BassardF/clock`).
2.  Click on **"Settings"**.
3.  In the left sidebar, click on **"Pages"**.
4.  Under **"Build and deployment"**, ensure that **"Source"** is set to **"Deploy from a branch"**.
5.  Under **"Branch"**, confirm it's set to `gh-pages` and the folder is `/ (root)`.
6.  Click **"Save"** if you make any changes. It might take a few minutes for updates to propagate.
