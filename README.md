# Music Gift

这是一个可以直接部署到 GitHub Pages 的静态音乐播放器。

## 怎么添加歌曲

1. 把 MP3 文件上传到 `assets/music/`
2. 如果这首歌需要封面，把图片上传到 `assets/covers/`
3. 打开 `songs.json`，添加一条配置

有封面的写法：

```json
{
  "id": "birthday",
  "title": "歌曲名",
  "artist": "歌手名",
  "audio": "assets/music/song.mp3",
  "cover": "assets/covers/song.jpg"
}
```

没有单独封面的写法：

```json
{
  "id": "song-without-cover",
  "title": "歌曲名",
  "artist": "歌手名",
  "audio": "assets/music/song.mp3"
}
```

不写 `cover` 时，页面会自动使用 `assets/covers/default-cover.svg`。

## 怎么访问单独一首歌

每首歌都建议配置一个唯一的 `id`，例如：

```json
{
  "id": "birthday",
  "title": "生日快乐",
  "artist": "送给 Tang",
  "audio": "assets/music/birthday.mp3",
  "cover": "assets/covers/birthday.jpg"
}
```

然后单独访问这首歌的播放器页面：

```text
https://rex248264-boop.github.io/mucis_birthdat_gift/?song=birthday
```

页面打开后会自动选中这首歌，并显示它的封面。点播放列表里的其他歌时，地址栏也会自动更新成对应的单曲链接。

如果只是想访问 MP3 文件本身，链接是：

```text
https://rex248264-boop.github.io/mucis_birthdat_gift/assets/music/birthday.mp3
```

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
- `id` 建议使用英文、数字、短横线，例如 `birthday-song`。
- 文件路径大小写必须完全一致。
- MP3 和封面文件名建议使用英文、数字、短横线，避免空格。
