import { useState, useMemo } from 'react'

function RegexTester() {
  const [pattern, setPattern] = useState('')
  const [testText, setTestText] = useState('')
  const [flags, setFlags] = useState({ g: true, i: false, m: false })
  const [error, setError] = useState(null)

  const { matches, highlightedText } = useMemo(() => {
    if (!pattern || !testText) {
      return { matches: [], highlightedText: testText }
    }

    try {
      setError(null)
      const flagStr = Object.entries(flags)
        .filter(([, enabled]) => enabled)
        .map(([flag]) => flag)
        .join('')
      
      const regex = new RegExp(pattern, flagStr)
      const matchResults = []
      
      if (flags.g) {
        let match
        while ((match = regex.exec(testText)) !== null) {
          matchResults.push({
            index: match.index,
            length: match[0].length,
            value: match[0],
            groups: match.slice(1)
          })
        }
      } else {
        const match = regex.exec(testText)
        if (match) {
          matchResults.push({
            index: match.index,
            length: match[0].length,
            value: match[0],
            groups: match.slice(1)
          })
        }
      }

      let text = testText
      let result = []
      let lastIndex = 0

      for (let i = 0; i < matchResults.length; i++) {
        const match = matchResults[i]
        if (match.index > lastIndex) {
          result.push(
            <span key={`text-${i}`}>
              {text.slice(lastIndex, match.index)}
            </span>
          )
        }
        result.push(
          <span key={`match-${i}`} className="regex-match">
            {text.slice(match.index, match.index + match.length)}
          </span>
        )
        lastIndex = match.index + match.length
      }

      if (lastIndex < text.length) {
        result.push(
          <span key="text-end">
            {text.slice(lastIndex)}
          </span>
        )
      }

      return { matches: matchResults, highlightedText: result }
    } catch (e) {
      setError(e.message)
      return { matches: [], highlightedText: testText }
    }
  }, [pattern, testText, flags])

  const toggleFlag = (flag) => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }))
  }

  return (
    <div className="regex-tester">
      <div className="regex-input-section">
        <div className="regex-pattern-container">
          <h3>正则表达式</h3>
          <div className="regex-pattern-input-wrapper">
            <span className="regex-delimiter">/</span>
            <input
              type="text"
              className="regex-pattern-input"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="输入正则表达式..."
            />
            <span className="regex-delimiter">/</span>
            <span className="regex-flags-display">
              {flags.g ? 'g' : ''}
              {flags.i ? 'i' : ''}
              {flags.m ? 'm' : ''}
            </span>
          </div>
          {error && <div className="regex-error">{error}</div>}
        </div>

        <div className="regex-flags-section">
          <h3>修饰符</h3>
          <div className="regex-flags">
            <label className="regex-flag-label">
              <input
                type="checkbox"
                checked={flags.g}
                onChange={() => toggleFlag('g')}
              />
              <span>全局匹配 (g)</span>
            </label>
            <label className="regex-flag-label">
              <input
                type="checkbox"
                checked={flags.i}
                onChange={() => toggleFlag('i')}
              />
              <span>忽略大小写 (i)</span>
            </label>
            <label className="regex-flag-label">
              <input
                type="checkbox"
                checked={flags.m}
                onChange={() => toggleFlag('m')}
              />
              <span>多行模式 (m)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="regex-content">
        <div className="regex-test-container">
          <h3>测试文本</h3>
          <textarea
            className="regex-test-input"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="在此输入要测试的文本..."
          />
        </div>

        <div className="regex-results-container">
          <h3>匹配结果</h3>
          <div className="regex-highlight">
            {highlightedText || <div className="regex-placeholder">请输入正则表达式和测试文本</div>}
          </div>
          <div className="regex-match-count">
            匹配次数: {matches.length}
          </div>
          {matches.length > 0 && (
            <div className="regex-match-details">
              <h4>匹配详情</h4>
              {matches.map((match, index) => (
                <div key={index} className="regex-match-item">
                  <div className="regex-match-header">
                    匹配 {index + 1}: <span className="regex-match-value">"{match.value}"</span>
                  </div>
                  {match.groups.length > 0 && (
                    <div className="regex-groups">
                      捕获分组:
                      {match.groups.map((group, gIndex) => (
                        <div key={gIndex} className="regex-group">
                          分组 {gIndex + 1}: <span className="regex-group-value">"{group || '(空)'}"</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegexTester
