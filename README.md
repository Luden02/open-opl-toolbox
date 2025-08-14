![Logo](assets/logo.svg)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Electron.js](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Chakra](https://img.shields.io/badge/chakra-%234ED1C5.svg?style=for-the-badge&logo=chakraui&logoColor=white)

OpenOPL Toolbox – A modern, cross-platform way to manage your OPL game collection.

# 📖 About

OpenOPL Toolbox is an open-source and cross-platform application for organizing your PlayStation 2 game library.

It was created to fill the gap left by OPLManager, which lacks macOS and Linux support.
The goal isn’t to replace OPLManager, but to offer an alternative — one that’s modern, intuitive, and built with technologies familiar to JavaScript developers.

# ✨ Features

## 📂 Supported Filesystems

Currently, OpenOPL Toolbox supports any directory that your operating system can mount.
This means you can work with:
   -	MX4SIO (SD card adapters)
   - USB drives (FAT32 / exFAT / NTFS, depending on your OS)
   -	Internal folders on your PC or Mac

💡 Note: Direct access to PS2-formatted internal HDDs (APA / PFS) is not yet supported, but it’s on our research and development roadmap for future versions.


## ✅ Current

- Cross-Platform: Windows, macOS, and Linux support
- Game Library Management: View your OPL collection and rename your files.
- Modern UI: Built with React + Chakra UI for a clean, user-friendly experience
- Game artwork: "Auto-Import-from-Web" Functionality
- Rename: Game Name or GameId Renaming

## 🚧 Roadmap

### Short Term

- Single-file & batch game import (.iso / .bin.cue)
- Auto-rename imports to pattern-based .iso
- Search & filter games

### Long Term

- PS1 and APPS support
- Cheats management
- CFG support (TBD)
- Additional community-requested features

📝 The roadmap evolves based on feedback and development priorities.

## 💻 Installation

Grab the latest release from the Releases page. [Releases](https://github.com/StefanAdrianNita/open-opl-toolbox/releases) page.

### 🐧 Linux

1. Download the **Linux `.zip`** file.
2. Extract it.
3. Run the `open-opl-toolbox` file.

---

### 🍏 macOS

1. Download the `.dmg` file for your architecture:
   - **x64** (Intel Macs)
   - **arm64** (Apple Silicon — _recommended and tested_)
2. Open the `.dmg` file.
3. Drag **CrossOPL Toolbox** to your **Applications** folder.
4. Run the app.

---

### 🪟 Windows

1. Download the `setup.exe`.
2. Run it — after some loading time, you'll find the app on your **Desktop**.  
   _(A fully portable `.exe` is not available yet.)_

## 🚀 Getting Started

1. Launch OpenOPLToolbox
2. Select your OPL Library root folder (internal directory or external drive)
3. Use the interface to see, and manage your game collection
4. Rename your files or grab your artwork!
5. Enjoy!

# 📜 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

# 🤝 Contributing

Contributions are welcome! Here's how you can help improve OpenOPLToolbox:

## Ways to Contribute

- **Bug Reports**: Found an issue? Please open a bug report with detailed steps to reproduce
- **Feature Requests**: Have an idea for improvement? Submit a feature request
- **Code Contributions**: Submit pull requests for bug fixes or new features
- **Testing**: Test new releases and provide feedback

## Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Luden02/open-opl-toolbox.git
   cd open-opl-toolbox
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start
   ```

## Pull Request Process

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them with clear messages
4. Push to your fork and submit a pull request
5. Ensure your code follows the project's coding standards
