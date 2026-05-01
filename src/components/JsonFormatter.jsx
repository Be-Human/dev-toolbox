import { useState, useEffect } from 'react'

function JsonFormatter() {
  const [input, setInput] = useState('')
  const [parsedJson, setParsedJson] = useState(null)
  const [error, setError] = useState(null)
  const [expandedNodes, setExpandedNodes] = useState(new Set(['root']))
  const [formattedOutput, setFormattedOutput] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    try {
      if (input.trim()) {
        const parsed = JSON.parse(input)
        setParsedJson(parsed)
        setError(null)
        setFormattedOutput(JSON.stringify(parsed, null, 2))
      } else {
        setParsedJson(null)
        setError(null)
        setFormattedOutput('')
      }
    } catch (e) {
      setParsedJson(null)
      setError(e.message)
      setFormattedOutput('')
    }
  }, [input])

  const toggleNode = (path) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const renderJsonTree = (data, path = 'root', level = 0) => {
    if (data === null) {
      return <span className="json-null">null</span>
    }

    if (typeof data === 'string') {
      return <span className="json-string">"{data}"</span>
    }

    if (typeof data === 'number') {
      return <span className="json-number">{data}</span>
    }

    if (typeof data === 'boolean') {
      return <span className="json-boolean">{data.toString()}</span>
    }

    const isArray = Array.isArray(data)
    const items = isArray ? data : Object.entries(data)
    const isExpanded = expandedNodes.has(path)

    return (
      <div className="json-node">
        <div className="json-header" onClick={() => toggleNode(path)}>
          <span className="json-bracket">{isArray ? '[' : '{'}</span>
          <span className="json-count">
            {isArray ? `Array(${data.length})` : `Object(${Object.keys(data).length})`}
          </span>
          <span className="json-toggle">{isExpanded ? '▼' : '▶'}</span>
        </div>
        {isExpanded && (
          <div className="json-items">
            {items.map((item, index) => {
              const key = isArray ? index : item[0]
              const value = isArray ? item : item[1]
              const newPath = `${path}.${key}`

              return (
                <div key={key} className="json-item">
                  {!isArray && (
                    <span className="json-key">"{key}": </span>
                  )}
                  {renderJsonTree(value, newPath, level + 1)}
                  {index < items.length - 1 && <span className="json-comma">,</span>}
                </div>
              )
            })}
          </div>
        )}
        <div className="json-bracket json-close">
          {isArray ? ']' : '}'}
        </div>
      </div>
    )
  }

  const compressJson = () => {
    if (parsedJson) {
      const compressed = JSON.stringify(parsedJson)
      setInput(compressed)
    }
  }

  const expandJson = () => {
    if (parsedJson) {
      const expanded = JSON.stringify(parsedJson, null, 2)
      setInput(expanded)
    }
  }

  const copyToClipboard = () => {
    if (formattedOutput) {
      navigator.clipboard.writeText(formattedOutput)
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
    <div className="json-formatter">
      <div className="json-toolbar">
        <button className="json-button" onClick={expandJson} disabled={!parsedJson}>
          一键展开
        </button>
        <button className="json-button" onClick={compressJson} disabled={!parsedJson}>
          一键压缩
        </button>
        <button className="json-button copy-button" onClick={copyToClipboard} disabled={!formattedOutput}>
          {copySuccess ? '已复制' : '复制结果'}
        </button>
      </div>

      <div className="json-content">
        <div className="json-input-container">
          <h3>输入 JSON</h3>
          <textarea
            className="json-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="在此粘贴 JSON 数据..."
          />
          {error && <div className="json-error">{error}</div>}
        </div>

        <div className="json-output-container">
          <h3>格式化结果</h3>
          <div className="json-output">
            {parsedJson ? renderJsonTree(parsedJson) : <div className="json-placeholder">请输入有效的 JSON</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default JsonFormatter