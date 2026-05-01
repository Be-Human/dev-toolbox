import { useState, useEffect } from 'react'

function Base64Codec() {
  const [mode, setMode] = useState('encode')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState(null)
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    if (!input.trim()) {
      setOutput('')
      setError(null)
      return
    }

    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))))
        setError(null)
      } else {
        setOutput(decodeURIComponent(escape(atob(input))))
        setError(null)
      }
    } catch (e) {
      setOutput('')
      setError('非法 Base64 格式，请检查输入内容')
    }
  }, [input, mode])

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setError(null)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError(null)
  }

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output)
        .then(() => {
          setCopySuccess(true)
          setTimeout(() => setCopySuccess(false), 2000)
        })
        .catch(err => {
          console.error('复制失败:', err)
        })
    }
  }

  return (
    <div className="base64-codec">
      <div className="base64-toolbar">
        <div className="base64-mode-toggle">
          <button
            className={`mode-button ${mode === 'encode' ? 'active' : ''}`}
            onClick={() => handleModeChange('encode')}
          >
            编码 (Encode)
          </button>
          <button
            className={`mode-button ${mode === 'decode' ? 'active' : ''}`}
            onClick={() => handleModeChange('decode')}
          >
            解码 (Decode)
          </button>
        </div>
        <div className="base64-actions">
          <button className="base64-button" onClick={handleClear}>
            一键清空
          </button>
          <button
            className="base64-button copy-button"
            onClick={handleCopy}
            disabled={!output}
          >
            {copySuccess ? '已复制' : '复制结果'}
          </button>
        </div>
      </div>

      <div className="base64-content">
        <div className="base64-input-container">
          <h3>{mode === 'encode' ? '输入文本' : '输入 Base64'}</h3>
          <textarea
            className="base64-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? '在此输入要编码的文本...' : '在此输入要解码的 Base64 字符串...'}
          />
        </div>

        <div className="base64-output-container">
          <h3>{mode === 'encode' ? 'Base64 结果' : '文本结果'}</h3>
          <div className="base64-output">
            {output || <div className="base64-placeholder">转换结果将显示在这里</div>}
          </div>
        </div>
      </div>

      {error && (
        <div className="base64-error">
          {error}
        </div>
      )}

      <div className="base64-info">
        <div className="info-item">
          <span className="info-label">编码模式：</span>
          <span className="info-value">将普通文本转换为 Base64 字符串</span>
        </div>
        <div className="info-item">
          <span className="info-label">解码模式：</span>
          <span className="info-value">将 Base64 字符串还原为普通文本</span>
        </div>
      </div>
    </div>
  )
}

export default Base64Codec