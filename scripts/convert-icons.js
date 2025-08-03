const fs = require('fs')
const { createCanvas, loadImage } = require('canvas')

async function convertSvgToPng() {
  const sizes = [16, 48, 128]
  
  for (const size of sizes) {
    const pngPath = `./public/icon${size}.png`
    
    const canvas = createCanvas(size, size)
    const ctx = canvas.getContext('2d')
    
    // 创建背景
    ctx.fillStyle = '#4CAF50'
    ctx.fillRect(0, 0, size, size)
    
    // 绘制大写字母 B
    ctx.fillStyle = 'white'
    ctx.font = `bold ${size * 0.7}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('B', size / 2, size / 2)
    
    // 保存为 PNG
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(pngPath, buffer)
    
    console.log(`✅ 生成 ${pngPath}`)
  }
}

convertSvgToPng().catch(console.error)