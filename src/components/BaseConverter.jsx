import { useState, useEffect } from 'react'

function BaseConverter() {
  const [binary, setBinary] = useState('')
  const [octal, setOctal] = useState('')
  const [decimal, setDecimal] = useState('')
  const [hex, setHex] = useState('')
  const [error, setError] = useState(null)
  const [source, setSource] = useState(null)
  const [copySuccess, setCopySuccess] = useState({})

  const validateBinary = (value) => {
    return /^[01]*$/.test(value)
  }

  const validateOctal = (value) => {
    return /^[0-7]*$/.test(value)
  }

  const validateDecimal = (value) => {
    return /^[0-9]*$/.test(value)
  }

  const validateHex = (value) => {
    return /^[0-9a-fA-F]*$/.test(value)
  }

  useEffect(() => {
    if (!source) {
      setError(null)
      return
    }

    try {
      let decimalValue = null

      if (source === 'binary') {
        if (!binary.trim()) {
          setOctal('')
          setDecimal('')
          setHex('')
          setError(null)
          return
        }

        if (!validateBinary(binary)) {
          setError('无效的二进制格式，请输入 0 和 1 组成的数字')
          setOctal('')
          setDecimal('')
          setHex('')
          return
        }

        decimalValue = parseInt(binary, 2)
        setError(null)
      } else if (source === 'octal') {
        if (!octal.trim()) {
          setBinary('')
          setDecimal('')
          setHex('')
          setError(null)
          return
        }

        if (!validateOctal(octal)) {
          setError('无效的八进制格式，请输入 0-7 组成的数字')
          setBinary('')
          setDecimal('')
          setHex('')
          return
        }

        decimalValue = parseInt(octal, 8)
        setError(null)
      } else if (source === 'decimal') {
        if (!decimal.trim()) {
          setBinary('')
          setOctal('')
          setHex('')
          setError(null)
          return
        }

        if (!validateDecimal(decimal)) {
          setError('无效的十进制格式，请输入 0-9 组成的数字')
          setBinary('')
          setOctal('')
          setHex('')
          return
        }

        decimalValue = parseInt(decimal, 10)
        setError(null)
      } else if (source === 'hex') {
        if (!hex.trim()) {
          setBinary('')
          setOctal('')
          setDecimal('')
          setError(null)
          return
        }

        if (!validateHex(hex)) {
          setError('无效的十六进制格式，请输入 0-9 或 A-F（不区分大小写）组成的数字')
          setBinary('')
          setOctal('')
          setDecimal('')
          return
        }

        decimalValue = parseInt(hex, 16)
        setError(null)
      }

      if (decimalValue !== null && !isNaN(decimalValue)) {
        if (source !== 'binary') {
          setBinary(decimalValue.toString(2))
        }
        if (source !== 'octal') {
          setOctal(decimalValue.toString(8))
        }
        if (source !== 'decimal') {
          setDecimal(decimalValue.toString(10))
        }
        if (source !== 'hex') {
          setHex(decimalValue.toString(16).toUpperCase())
        }
      }
    } catch (e) {
      setError('进制转换失败，请检查输入格式')
    }
  }, [binary, octal, decimal, hex, source])

  const handleBinaryChange = (value) => {
    setBinary(value)
    setSource('binary')
  }

  const handleOctalChange = (value) => {
    setOctal(value)
    setSource('octal')
  }

  const handleDecimalChange = (value) => {
    setDecimal(value)
    setSource('decimal')
  }

  const handleHexChange = (value) => {
    setHex(value.toUpperCase())
    setSource('hex')
  }

  const handleClear = () => {
    setBinary('')
    setOctal('')
    setDecimal('')
    setHex('')
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

  return (
    <div className="base-converter">
      <div className="base-toolbar">
        <div className="base-info-banner">
          <span className="base-info-icon">ℹ️</span>
          <span>在任意输入框输入数值，其他进制将自动转换</span>
        </div>
        <div className="base-actions">
          <button className="base-button" onClick={handleClear}>
            一键清空
          </button>
        </div>
      </div>

      <div className="base-content">
        <div className="base-input-row">
          <div className="base-input-container">
            <div className="base-input-header">
              <h3>二进制 (Binary)</h3>
              <span className="base-base-label">基数: 2</span>
              <button 
                className="copy-small-button"
                onClick={() => handleCopy(binary, 'binary')}
                disabled={!binary}
              >
                {copySuccess.binary ? '已复制' : '复制'}
              </button>
            </div>
            <div className="base-input-wrapper">
              <span className="base-prefix">0b</span>
              <input
                type="text"
                className="base-input"
                value={binary}
                onChange={(e) => handleBinaryChange(e.target.value)}
                placeholder="11010110"
                spellCheck={false}
              />
            </div>
            <div className="base-valid-chars">
              有效字符: <code>0, 1</code>
            </div>
          </div>

          <div className="base-input-container">
            <div className="base-input-header">
              <h3>八进制 (Octal)</h3>
              <span className="base-base-label">基数: 8</span>
              <button 
                className="copy-small-button"
                onClick={() => handleCopy(octal, 'octal')}
                disabled={!octal}
              >
                {copySuccess.octal ? '已复制' : '复制'}
              </button>
            </div>
            <div className="base-input-wrapper">
              <span className="base-prefix">0o</span>
              <input
                type="text"
                className="base-input"
                value={octal}
                onChange={(e) => handleOctalChange(e.target.value)}
                placeholder="326"
                spellCheck={false}
              />
            </div>
            <div className="base-valid-chars">
              有效字符: <code>0-7</code>
            </div>
          </div>
        </div>

        <div className="base-input-row">
          <div className="base-input-container">
            <div className="base-input-header">
              <h3>十进制 (Decimal)</h3>
              <span className="base-base-label">基数: 10</span>
              <button 
                className="copy-small-button"
                onClick={() => handleCopy(decimal, 'decimal')}
                disabled={!decimal}
              >
                {copySuccess.decimal ? '已复制' : '复制'}
              </button>
            </div>
            <div className="base-input-wrapper">
              <span className="base-prefix">#</span>
              <input
                type="text"
                className="base-input"
                value={decimal}
                onChange={(e) => handleDecimalChange(e.target.value)}
                placeholder="214"
                spellCheck={false}
              />
            </div>
            <div className="base-valid-chars">
              有效字符: <code>0-9</code>
            </div>
          </div>

          <div className="base-input-container">
            <div className="base-input-header">
              <h3>十六进制 (Hexadecimal)</h3>
              <span className="base-base-label">基数: 16</span>
              <button 
                className="copy-small-button"
                onClick={() => handleCopy(hex, 'hex')}
                disabled={!hex}
              >
                {copySuccess.hex ? '已复制' : '复制'}
              </button>
            </div>
            <div className="base-input-wrapper">
              <span className="base-prefix">0x</span>
              <input
                type="text"
                className="base-input hex-input"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="D6"
                spellCheck={false}
              />
            </div>
            <div className="base-valid-chars">
              有效字符: <code>0-9, A-F</code>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="base-error">
          {error}
        </div>
      )}

      <div className="base-info">
        <div className="info-item">
          <span className="info-label">二进制：</span>
          <span className="info-value">以 2 为基数，只使用 0 和 1 两个数字</span>
        </div>
        <div className="info-item">
          <span className="info-label">八进制：</span>
          <span className="info-value">以 8 为基数，使用 0-7 八个数字</span>
        </div>
        <div className="info-item">
          <span className="info-label">十进制：</span>
          <span className="info-value">以 10 为基数，使用 0-9 十个数字</span>
        </div>
        <div className="info-item">
          <span className="info-label">十六进制：</span>
          <span className="info-value">以 16 为基数，使用 0-9 和 A-F（或 a-f）</span>
        </div>
      </div>
    </div>
  )
}

export default BaseConverter
