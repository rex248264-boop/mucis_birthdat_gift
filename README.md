# Music Gift

这是一个可以直接部署到 GitHub Pages 的静态音乐播放器。

## 怎么添加歌曲

1. 把 MP3 文件上传到 `assets/music/`
2. 如果这首歌需要封面，把图片上传到 `assets/covers/`
3. 打开 `songs.json`，添加一条配置

有封面的写法：

```json
{
  "title": "歌曲名",
  "artist": "歌手名",
  "audio": "assets/music/song.mp3",
  "cover": "assets/covers/song.jpg"
}
```

没有单独封面的写法：

```json
{
  "title": "歌曲名",
  "artist": "歌手名",
  "audio": "assets/music/song.mp3"
}
```

不写 `cover` 时，页面会自动使用 `assets/covers/default-cover.svg`。

## 开启 GitHub Pages

进入仓库的 `Settings` -> `Pages`：

- Source: `Deploy from a branch`
- Branch: `main`
- Folder: `/root`

保存后等待一两分钟，访问：

```text
https://rex248264-boop.github.io/mucis_birthdat_gift/
```

## 重要提示

- `songs.json` 里只配置你想展示和播放的歌曲。
- 文件路径大小写必须完全一致。
- MP3 和封面文件名建议使用英文、数字、短横线，避免空格。
