# Development
This document will provide instrunctions on the development process for the web project. Note that this project uses Docker.

1. Make sure to have Docker installed
2. Pull the directory using `git clone https://github.com/3OOYOON/Quaver.git`
3. Open the Quaver folder in VSCode
4. A prompt should pop up in the bottom-right to "enter container." Do so if it shows up. Otherwise:
  a) Run: `docker build -t quaver .`.
  b) Then, run `docker run -p 3000:3000 quaver`
5. This may take several minutes to load
