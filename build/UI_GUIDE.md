# 安装包 UI 自定义指南

您可以将自定义图片放入此 `build` 文件夹中，打包时会自动生效。

## 1. 侧边栏图片 (installerSidebar.bmp)
- **文件名**: `installerSidebar.bmp`
- **用途**: 安装程序左侧的竖长图片。
- **推荐尺寸**: 164 x 314 像素
- **格式**: BMP

## 2. 顶部标题图片 (installerHeader.bmp)
- **文件名**: `installerHeader.bmp`
- **用途**: 安装程序顶部的横幅图片（如果未启用侧边栏或特定页面）。
- **推荐尺寸**: 150 x 57 像素
- **格式**: BMP

## 3. 图标 (icon.ico)
- **文件名**: `icon.ico`
- **用途**: 应用程序图标和安装包图标。
- **注意**: 目前您的配置是指向 `resources/icon.ico`，如果这里也放一个，通常 `build` 目录的优先级较高或用于特定场景。

## 4. 卸载程序侧边栏 (uninstallerSidebar.bmp)
- **文件名**: `uninstallerSidebar.bmp`
- **用途**: 卸载程序左侧的图片。
- **推荐尺寸**: 164 x 314 像素
- **格式**: BMP

---
**提示**: 请确保图片格式为 BMP，且尺寸尽量符合建议，否则可能会被拉伸或显示不全。
