# **Breakmind**

**Breakmind** is a powerful, client-side web application that uses Artificial Intelligence to remove image backgrounds instantly. It operates entirely within the browser using TensorFlow.js, ensuring user privacy by never uploading images to an external server for processing.  
Additionally, the application features an interactive "Puzzle Mode" and a fully responsive, modern UI designed for both mobile and desktop experiences.  
**Live Demo:** [https://breakmind.lat](https://www.google.com/search?q=https://breakmind.lat)

## **✨ Features**

* **AI Background Removal:** Utilizes the @tensorflow-models/body-pix model to segment images and remove backgrounds in real-time.  
* **Privacy First:** All image processing happens locally on the client's device. No data is sent to a backend.  
* **Responsive Design:** Fluid typography and layout scaling using Tailwind CSS and custom clamp() utilities.  
* **Drag & Drop:** Intuitive file upload interface.  
* **Puzzle Mode:** Gamifies the experience by turning processed images into interactive puzzles.  
* **Custom UI Components:** Built with reusable React components using Lucide and React Icons.

## **🛠️ Tech Stack**

* **Framework:** [React](https://reactjs.org/) \+ [Vite](https://vitejs.dev/)  
* **Language:** TypeScript  
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)  
* **AI/ML:** [TensorFlow.js](https://www.tensorflow.org/js) (@tensorflow/tfjs, @tensorflow-models/body-pix)  
* **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)

## **🚀 Getting Started**

Follow these steps to set up the project locally on your machine.

### **Prerequisites**

* **Node.js:** Version 18.0.0 or higher is recommended.  
* **npm:** Typically installed with Node.js.

### **Installation**

1. **Clone the repository:**  
   git clone \[https://github.com/borregs/mindbreak-app.git\](https://github.com/borregs/mindbreak-app.git)  
   cd mindbreak-app

2. **Install dependencies:**  
   npm install

3. **Run the development server:**  
   npm run dev

   Open http://localhost:5173 to view it in the browser.

## **📜 Scripts**

| Script | Description |
| :---- | :---- |
| npm run dev | Starts the local development server with HMR. |
| npm run build | Compiles the TypeScript and builds the app for production in /dist. |
| npm run preview | Locally previews the production build. |
| npm run deploy | Builds the project and deploys it to GitHub Pages (gh-pages branch). |

## **🌐 Deployment & Custom Domain**

This project is deployed via GitHub Pages.  
Important Note for Custom Domains:  
The public/CNAME file ensures that the custom domain (breakmind.lat) persists after every deployment. If this file is missing, GitHub Pages may reset the custom domain settings.  
To deploy a new version:  
npm run deploy

## **📂 Project Structure**

mindbreak-app/  
├── public/  
│   ├── CNAME              \# Custom domain configuration  
│   └── vite.svg           \# Favicon/Icons  
├── src/  
│   ├── components/        \# Reusable UI components (Buttons, Cards, etc.)  
│   │   └── ui/  
│   ├── App.tsx            \# Main application logic & Routing  
│   ├── index.css          \# Global styles & Tailwind directives  
│   └── main.tsx           \# Entry point  
├── package.json           \# Dependencies and scripts  
├── vite.config.ts         \# Vite configuration (Base path settings)  
└── tsconfig.json          \# TypeScript configuration

## **🤝 Contributing**

Contributions are welcome\! Please feel free to submit a Pull Request.

## **📄 License**

This project is open source and available under the [MIT License](https://www.google.com/search?q=LICENSE).
