---
name: update-hero
description: "Update the hero video on the homepage. Use this skill whenever the user says they added, uploaded, or updated a hero video file, wants to change the main page video, mentions a new video for the homepage, or drops a video file into dist/videos/. Also trigger when the user says 'обнови видео', 'новое видео для главной', 'загрузил видео', 'обновил hero', or similar phrases in Russian about updating the homepage video."
---

# Update Hero Video

This skill handles the full pipeline for replacing the hero background video on the Москоллектор homepage: processing the video file for optimal browser playback, deploying it, busting the browser cache, and restarting the dev server.

## Why each step matters

- **Strip audio**: The `<video>` element uses `loop` for seamless looping. Audio tracks cause the browser to re-sync audio+video on each loop restart, which creates a visible jerk/stutter. Removing audio eliminates this.
- **faststart flag**: Moves the moov atom to the beginning of the MP4 file so the browser can start playback immediately without downloading the entire file first.
- **Cache bust**: Browsers aggressively cache video files. Without a new query parameter, users will see the old video even after replacing the file.

## Steps

### 1. Locate the new video file

The user typically drops new video files into:
```
/Users/anton/Desktop/code/app/dist/videos/hero.mp4
```

If the file isn't there, check these locations:
- `/Users/anton/Desktop/code/app/dist/videos/` (any .mp4 file)
- `/Users/anton/Desktop/code/` (root level .mp4 files)
- `/Users/anton/Desktop/` (desktop)

If you still can't find it, ask the user where they put the file.

### 2. Process the video with ffmpeg

Strip the audio track and add the faststart flag:

```bash
/opt/homebrew/bin/ffmpeg -y -i <input_file> -an -c:v copy -movflags +faststart /Users/anton/Desktop/code/app/public/videos/hero.mp4
```

- `-an` removes audio
- `-c:v copy` copies video stream without re-encoding (fast, no quality loss)
- `-movflags +faststart` moves moov atom for instant playback

If ffmpeg is not installed, install it: `/opt/homebrew/bin/brew install ffmpeg`

### 3. Update cache-bust parameter in Home.tsx

Generate an 8-character hash from the processed file:

```bash
md5 -q /Users/anton/Desktop/code/app/public/videos/hero.mp4 | head -c 8
```

Then update the video `src` attribute in `/Users/anton/Desktop/code/app/src/pages/Home.tsx`:

Find the line with `src="/videos/hero.mp4` and update the `?v=` parameter:
```
src="/videos/hero.mp4?v=<new_hash>"
```

### 4. Restart the dev server

```bash
# Kill existing server on port 5173
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Start fresh server via nvm
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && cd /Users/anton/Desktop/code/app && npx vite --port 5173
```

Run the server start command in the background.

### 5. Verify and notify

```bash
sleep 3 && curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/
```

Should return `200`. Then tell the user:
- The video has been updated
- The server is running on `http://localhost:5173/`
- To do a hard refresh: **Cmd+Shift+R**
