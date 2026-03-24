#!/bin/bash

# 修复图标放大问题

echo "开始修复图标放大问题..."

# 检查并删除自适应图标配置文件
if [ -d "android/app/src/main/res/mipmap-anydpi-v26" ]; then
  echo "删除自适应图标配置文件..."
  rm -f android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml
  rm -f android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml
  echo "自适应图标配置文件已删除"
fi

# 复制原始图标到所有 mipmap 目录
echo "复制原始图标到所有 mipmap 目录..."
mipmap_dirs=("android/app/src/main/res/mipmap-mdpi" "android/app/src/main/res/mipmap-hdpi" "android/app/src/main/res/mipmap-xhdpi" "android/app/src/main/res/mipmap-xxhdpi" "android/app/src/main/res/mipmap-xxxhdpi")

for dir in "${mipmap_dirs[@]}"; do
  if [ -d "$dir" ]; then
    cp qxjficon1.png "$dir/ic_launcher.png"
    cp qxjficon1.png "$dir/ic_launcher_round.png"
    cp qxjficon1.png "$dir/ic_launcher_foreground.png"
    echo "已更新 $dir 目录中的图标"
  fi

done

echo "图标修复完成！"
