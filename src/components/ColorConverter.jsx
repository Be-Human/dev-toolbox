import { useState, useEffect } from 'react'

function ColorConverter() {
  const [hex, setHex] = useState('')
  const [rgb, setRgb] = useState({ r: '', g: '', b: '' })
  const [hsl, setHsl] = useState({ h: '', s: '', l: '' })
  const [error, setError] = useState(null)
  const [source, setSource] = useState(null)
  const [copySuccess, setCopySuccess] = useState({})

  const hexToRgb = (hexValue) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexValue)
    if (result) {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    }
    const shortResult = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(hexValue)
    if (shortResult) {
      return {
        r: parseInt(shortResult[1] + shortResult[1], 16),
        g: parseInt(shortResult[2] + shortResult[2], 16),
        b: parseInt(shortResult[3] + shortResult[3], 16)
      }
    }
    return null
  }

  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  const rgbToHsl = (r, g, b) => {
    r /= 255
    g /= 255
    b /= 255
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h, s, l = (max + min) / 2

    if (max === min) {
      h = s = 0
    } else {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
        default: h = 0
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  const hslToRgb = (h, s, l) => {
    h /= 360
    s /= 100
    l /= 100
    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }

  useEffect(() => {
    if (!source) {
      setError(null)
      return
    }

    try {
      if (source === 'hex') {
        if (!hex.trim()) {
          setRgb({ r: '', g: '', b: '' })
          setHsl({ h: '', s: '', l: '' })
          setError(null)
          return
        }

        const rgbResult = hexToRgb(hex)
        if (rgbResult) {
          setRgb(rgbResult)
          const hslResult = rgbToHsl(rgbResult.r, rgbResult.g, rgbResult.b)
          setHsl(hslResult)
          setError(null)
        } else {
          setError('无效的 HEX 颜色格式，请输入如 #FF5733 或 FF5733')
        }
      } else if (source === 'rgb') {
        const { r, g, b } = rgb
        if (r === '' && g === '' && b === '') {
          setHex('')
          setHsl({ h: '', s: '', l: '' })
          setError(null)
          return
        }

        const rNum = parseInt(r, 10)
        const gNum = parseInt(g, 10)
        const bNum = parseInt(b, 10)

        if (!isNaN(rNum) && !isNaN(gNum) && !isNaN(bNum) &&
            rNum >= 0 && rNum <= 255 &&
            gNum >= 0 && gNum <= 255 &&
            bNum >= 0 && bNum <= 255) {
          setHex(rgbToHex(rNum, gNum, bNum))
          const hslResult = rgbToHsl(rNum, gNum, bNum)
          setHsl(hslResult)
          setError(null)
        } else {
          setError('无效的 RGB 颜色格式，每个通道值应在 0-255 之间')
        }
      } else if (source === 'hsl') {
        const { h, s, l } = hsl
        if (h === '' && s === '' && l === '') {
          setHex('')
          setRgb({ r: '', g: '', b: '' })
          setError(null)
          return
        }

        const hNum = parseInt(h, 10)
        const sNum = parseInt(s, 10)
        const lNum = parseInt(l, 10)

        if (!isNaN(hNum) && !isNaN(sNum) && !isNaN(lNum) &&
            hNum >= 0 && hNum <= 360 &&
            sNum >= 0 && sNum <= 100 &&
            lNum >= 0 && lNum <= 100) {
          const rgbResult = hslToRgb(hNum, sNum, lNum)
          setRgb(rgbResult)
          setHex(rgbToHex(rgbResult.r, rgbResult.g, rgbResult.b))
          setError(null)
        } else {
          setError('无效的 HSL 颜色格式，H: 0-360, S/L: 0-100')
        }
      }
    } catch (e) {
      setError('颜色转换失败，请检查输入格式')
    }
  }, [hex, rgb, hsl, source])

  const handleHexChange = (value) => {
    setHex(value)
    setSource('hex')
  }

  const handleRgbChange = (channel, value) => {
    setRgb(prev => ({ ...prev, [channel]: value }))
    setSource('rgb')
  }

  const handleHslChange = (channel, value) => {
    setHsl(prev => ({ ...prev, [channel]: value }))
    setSource('hsl')
  }

  const handleClear = () => {
    setHex('')
    setRgb({ r: '', g: '', b: '' })
    setHsl({ h: '', s: '', l: '' })
    setError(null)
    setSource(null)
  }

  const handleCopy = (text, type) => {
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopySuccess(prev => ({ ...prev, [type]: true }))
          setTimeout(() => {
            setCopySuccess(prev => ({ ...prev, [type]: false }))
          }, 2000)
        })
        .catch(err => {
          console.error('复制失败:', err)
        })
    }
  }

  const getPreviewColor = () => {
    if (hex && hex.length >= 6) {
      const rgbFromHex = hexToRgb(hex)
      if (rgbFromHex) {
        return rgbToHex(rgbFromHex.r, rgbFromHex.g, rgbFromHex.b)
      }
    }
    if (rgb.r !== '' && rgb.g !== '' && rgb.b !== '') {
      const rNum = parseInt(rgb.r, 10)
      const gNum = parseInt(rgb.g, 10)
      const bNum = parseInt(rgb.b, 10)
      if (!isNaN(rNum) && !isNaN(gNum) && !isNaN(bNum) &&
          rNum >= 0 && rNum <= 255 &&
          gNum >= 0 && gNum <= 255 &&
          bNum >= 0 && bNum <= 255) {
        return rgbToHex(rNum, gNum, bNum)
      }
    }
    return '#cccccc'
  }

  return (
    <div className="color-converter">
      <div className="color-toolbar">
        <div className="color-preview-section">
          <div 
            className="color-preview" 
            style={{ backgroundColor: getPreviewColor() }}
          />
          <span className="color-preview-label">颜色预览</span>
        </div>
        <div className="color-actions">
          <button className="color-button" onClick={handleClear}>
            一键清空
          </button>
        </div>
      </div>

      <div className="color-content">
        <div className="color-input-container">
          <div className="color-input-header">
            <h3>HEX</h3>
            <button 
              className="copy-small-button"
              onClick={() => handleCopy(hex, 'hex')}
              disabled={!hex}
            >
              {copySuccess.hex ? '已复制' : '复制'}
            </button>
          </div>
          <div className="color-input-wrapper">
            <span className="color-prefix">#</span>
            <input
              type="text"
              className="color-input"
              value={hex.replace('#', '')}
              onChange={(e) => handleHexChange(e.target.value)}
              placeholder="FF5733"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="color-input-container">
          <div className="color-input-header">
            <h3>RGB</h3>
            <button 
              className="copy-small-button"
              onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
              disabled={rgb.r === '' || rgb.g === '' || rgb.b === ''}
            >
              {copySuccess.rgb ? '已复制' : '复制'}
            </button>
          </div>
          <div className="rgb-inputs">
            <div className="rgb-channel">
              <label>R</label>
              <input
                type="number"
                min="0"
                max="255"
                className="color-channel-input"
                value={rgb.r}
                onChange={(e) => handleRgbChange('r', e.target.value)}
                placeholder="255"
              />
            </div>
            <div className="rgb-channel">
              <label>G</label>
              <input
                type="number"
                min="0"
                max="255"
                className="color-channel-input"
                value={rgb.g}
                onChange={(e) => handleRgbChange('g', e.target.value)}
                placeholder="87"
              />
            </div>
            <div className="rgb-channel">
              <label>B</label>
              <input
                type="number"
                min="0"
                max="255"
                className="color-channel-input"
                value={rgb.b}
                onChange={(e) => handleRgbChange('b', e.target.value)}
                placeholder="51"
              />
            </div>
          </div>
        </div>

        <div className="color-input-container">
          <div className="color-input-header">
            <h3>HSL</h3>
            <button 
              className="copy-small-button"
              onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
              disabled={hsl.h === '' || hsl.s === '' || hsl.l === ''}
            >
              {copySuccess.hsl ? '已复制' : '复制'}
            </button>
          </div>
          <div className="hsl-inputs">
            <div className="hsl-channel">
              <label>H</label>
              <input
                type="number"
                min="0"
                max="360"
                className="color-channel-input"
                value={hsl.h}
                onChange={(e) => handleHslChange('h', e.target.value)}
                placeholder="14"
              />
              <span className="hsl-unit">°</span>
            </div>
            <div className="hsl-channel">
              <label>S</label>
              <input
                type="number"
                min="0"
                max="100"
                className="color-channel-input"
                value={hsl.s}
                onChange={(e) => handleHslChange('s', e.target.value)}
                placeholder="100"
              />
              <span className="hsl-unit">%</span>
            </div>
            <div className="hsl-channel">
              <label>L</label>
              <input
                type="number"
                min="0"
                max="100"
                className="color-channel-input"
                value={hsl.l}
                onChange={(e) => handleHslChange('l', e.target.value)}
                placeholder="60"
              />
              <span className="hsl-unit">%</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="color-error">
          {error}
        </div>
      )}

      <div className="color-info">
        <div className="info-item">
          <span className="info-label">HEX 格式：</span>
          <span className="info-value">#FF5733 或 FF5733（支持简写 #FFF）</span>
        </div>
        <div className="info-item">
          <span className="info-label">RGB 格式：</span>
          <span className="info-value">R: 0-255, G: 0-255, B: 0-255</span>
        </div>
        <div className="info-item">
          <span className="info-label">HSL 格式：</span>
          <span className="info-value">H: 0-360°, S: 0-100%, L: 0-100%</span>
        </div>
      </div>
    </div>
  )
}

export default ColorConverter
