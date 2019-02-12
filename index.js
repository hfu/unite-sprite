const config = require('config')
const spritezero = require('@mapbox/spritezero')
const fs = require('fs')

const table = config.get('table')
const makiDir = config.get('makiDir')

const generateSvgs = () => {
  let svgs = []
  for (let i = 0; i < table.length / 2; i++) {
    const id = table[2 * i]
    const svgPath = `${makiDir}/${table[2 * i + 1]}-11.svg`
    svgs.push({
      svg: fs.readFileSync(svgPath),
      id: id 
    })
  }
  return svgs
}

const suffix = (pxRatio) => {
  if (pxRatio === 1) {
    return ''
  } else {
    return `@${pxRatio}x`
  }
}

const generateSprite = (pxRatio, svgs) => {
  spritezero.generateLayout({
    imgs: svgs,
    pixelRatio: pxRatio,
    format: true
  }, (err, dataLayout) => {
    if (err) throw err
    fs.writeFileSync(
      `sprite${suffix(pxRatio)}.json`,
      JSON.stringify(dataLayout, null, 2)
    )
  })
  spritezero.generateLayout({
    imgs: svgs,
    pixelRatio: pxRatio,
    format: false
  }, (err, imageLayout) => {
    if (err) throw err
    spritezero.generateImage(imageLayout, (err, image) => {
      if (err) throw err
      fs.writeFileSync(`sprite${suffix(pxRatio)}.png`, image)
    })
  })
}

for (let pxRatio of [1, 2, 4]) {
  const svgs = generateSvgs()
  generateSprite(pxRatio, svgs)
}
