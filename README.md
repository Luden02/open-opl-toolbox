![Logo](assets/logo.svg)

![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Electron.js](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Chakra](https://img.shields.io/badge/chakra-%234ED1C5.svg?style=for-the-badge&logo=chakraui&logoColor=white)

OpenOPLToolbox is an open-source and cross-platform way to manage your OPL game collection.

This project was born from a lack of support of OPLManager for macOS and Linux operating systems, so I decided to give the community a more modern and better-supported way of handling their OPL library.

This project does not aim to replace OPLManager and never will—it's just another way of doing things that some people might prefer.

Electron and React were used to make development and maintenance of the codebase much faster and easily readable by developers skilled in JavaScript who might want to contribute and to make it visually pleasing in a way.

# Features and Roadmap

## ✅ Current Features

- **Cross-Platform Support**: Works on Windows, macOS, and Linux
- **OPL Library Management**: Organize and manage your PlayStation 2 game collection
- **Modern Interface**: Clean, intuitive UI built with React and Chakra UI

## 🚧 Roadmap

### Short Term (Next Release)

- [ ] Game metadata editing
- [ ] Auto-conversion on import to pattern-named .iso file
- [ ] Game artwork management and display
- [ ] Search and filter functionality

### Long Term

- [ ] Automatic metadata import through API Call
- [ ] PS1 and APPS support
- [ ] Cheats Management Support
- [ ] CFG (TBD)

> **Note**: This roadmap is subject to change based on community feedback and development priorities. Features may be added, modified, or reprioritized.

# How to Use

## Installation

Download the latest release for your operating system from the [Releases](https://github.com/StefanAdrianNita/open-opl-toolbox/releases) page.

### Windows

1. Download the `.exe` installer
2. Run the installer and follow the setup wizard
3. Launch OpenOPLToolbox from the Start Menu or desktop shortcut

### macOS

1. Download the `.dmg` file
2. Open the DMG and drag OpenOPLToolbox to your Applications folder
3. Launch from Applications or Spotlight

### Linux

1. Download the `.AppImage` file
2. Make it executable: `chmod +x OpenOPLToolbox-*.AppImage`
3. Run the AppImage directly or integrate it with your desktop environment

## Getting Started

1. Launch OpenOPLToolbox
2. Select your OPL Library root folder (internal directory or external drive)
3. Use the interface to organize, and manage your game collection
4. Configure game settings and artwork as needed

# License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

# Contribution

Contributions are welcome! Here's how you can help improve OpenOPLToolbox:

## Ways to Contribute

- **Bug Reports**: Found an issue? Please open a bug report with detailed steps to reproduce
- **Feature Requests**: Have an idea for improvement? Submit a feature request
- **Code Contributions**: Submit pull requests for bug fixes or new features
- **Testing**: Test new releases and provide feedback

## Development Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/StefanAdrianNita/open-opl-toolbox.git
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
