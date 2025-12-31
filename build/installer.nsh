!macro customHeader
  !system "echo '' > ${BUILD_RESOURCES_DIR}/customHeader"
!macroend

!macro preInit
  ; 在安装程序初始化之前执行
  ; 你可以在这里做一些环境检查
  ; MessageBox MB_OK "正在启动 SelectEatMenu 安装程序..."
!macroend

!macro customInit
  ; 在安装程序初始化时执行
  ; 修改欢迎页面的文案
  StrCpy $R0 "欢迎使用 SelectEatMenu 每日菜单选择器"
  StrCpy $R1 "这是一个自定义的安装向导界面。\n\n我们将引导您完成安装。"
  
  ; 你可以在这里修改更多的 UI 变量
!macroend

!macro customInstall
  ; 在文件复制完成后执行
  ; 比如写入注册表，或者配置环境变量
  DetailPrint "正在执行自定义配置..."
!macroend

; 自定义卸载过程
!macro customUnInstall
  DetailPrint "正在清理自定义配置..."
!macroend

; 覆盖默认的文本 (中文)
LangString ^Welcome 2052 "欢迎使用 SelectEatMenu"
LangString ^UninstallText 2052 "即将卸载 SelectEatMenu，所有数据将被清理。"
