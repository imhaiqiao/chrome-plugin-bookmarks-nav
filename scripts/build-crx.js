const fs = require('fs-extra')
const path = require('path')
const { execSync } = require('child_process')

async function buildCRX() {
  const distDir = path.join(__dirname, '../dist')
  const manifestPath = path.join(distDir, 'manifest.json')
  
  if (!fs.existsSync(manifestPath)) {
    console.error('manifest.json not found in dist directory')
    return
  }
  
  const manifest = fs.readJsonSync(manifestPath)
  
  try {
    // 创建 ZIP 文件
    const zipPath = path.join(distDir, `${manifest.name}_${manifest.version}.zip`)
    
    // 使用系统命令创建 ZIP 文件
    process.chdir(distDir)
    execSync('zip -r ../extension.zip .', { cwd: distDir })
    
    // 重命名 ZIP 文件
    if (fs.existsSync(path.join(distDir, '../extension.zip'))) {
      fs.moveSync(path.join(distDir, '../extension.zip'), zipPath)
    }
    
    console.log(`✅ ZIP 文件生成成功: ${manifest.name}_${manifest.version}.zip`)
    console.log('📝 您可以将此 ZIP 文件重命名为 .crx 后缀，或直接用于 Chrome 扩展程序加载')
  } catch (error) {
    console.error('ZIP 生成失败:', error)
  }
}

buildCRX()