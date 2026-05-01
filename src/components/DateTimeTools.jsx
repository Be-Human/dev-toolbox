import { useState, useEffect } from 'react'

const DATE_FORMATS = [
  { label: 'YYYY-MM-DD HH:mm:ss', format: 'YYYY-MM-DD HH:mm:ss' },
  { label: 'YYYY/MM/DD HH:mm:ss', format: 'YYYY/MM/DD HH:mm:ss' },
  { label: 'DD-MM-YYYY HH:mm:ss', format: 'DD-MM-YYYY HH:mm:ss' },
  { label: 'YYYY年MM月DD日 HH:mm:ss', format: 'YYYY年MM月DD日 HH:mm:ss' },
]

function formatDate(date, format) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

function parseDate(dateStr, format) {
  let year, month, day, hours = 0, minutes = 0, seconds = 0
  
  if (format === 'YYYY-MM-DD HH:mm:ss' || format === 'YYYY-MM-DD') {
    const parts = dateStr.split(/[ T]/)
    const dateParts = parts[0].split('-')
    year = parseInt(dateParts[0])
    month = parseInt(dateParts[1]) - 1
    day = parseInt(dateParts[2])
    if (parts[1]) {
      const timeParts = parts[1].split(':')
      hours = parseInt(timeParts[0]) || 0
      minutes = parseInt(timeParts[1]) || 0
      seconds = parseInt(timeParts[2]) || 0
    }
  } else if (format === 'YYYY/MM/DD HH:mm:ss' || format === 'YYYY/MM/DD') {
    const parts = dateStr.split(/[ T]/)
    const dateParts = parts[0].split('/')
    year = parseInt(dateParts[0])
    month = parseInt(dateParts[1]) - 1
    day = parseInt(dateParts[2])
    if (parts[1]) {
      const timeParts = parts[1].split(':')
      hours = parseInt(timeParts[0]) || 0
      minutes = parseInt(timeParts[1]) || 0
      seconds = parseInt(timeParts[2]) || 0
    }
  } else if (format === 'DD-MM-YYYY HH:mm:ss' || format === 'DD-MM-YYYY') {
    const parts = dateStr.split(/[ T]/)
    const dateParts = parts[0].split('-')
    day = parseInt(dateParts[0])
    month = parseInt(dateParts[1]) - 1
    year = parseInt(dateParts[2])
    if (parts[1]) {
      const timeParts = parts[1].split(':')
      hours = parseInt(timeParts[0]) || 0
      minutes = parseInt(timeParts[1]) || 0
      seconds = parseInt(timeParts[2]) || 0
    }
  } else if (format.includes('年')) {
    const match = dateStr.match(/(\d+)年(\d+)月(\d+)日\s*(\d+):(\d+):(\d+)?/)
    if (match) {
      year = parseInt(match[1])
      month = parseInt(match[2]) - 1
      day = parseInt(match[3])
      hours = parseInt(match[4]) || 0
      minutes = parseInt(match[5]) || 0
      seconds = parseInt(match[6]) || 0
    } else {
      const dateMatch = dateStr.match(/(\d+)年(\d+)月(\d+)日/)
      if (dateMatch) {
        year = parseInt(dateMatch[1])
        month = parseInt(dateMatch[2]) - 1
        day = parseInt(dateMatch[3])
      }
    }
  }

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    return null
  }

  return new Date(year, month, day, hours, minutes, seconds)
}

function DateTimeTools() {
  const [currentTimestamp, setCurrentTimestamp] = useState({
    seconds: Math.floor(Date.now() / 1000),
    milliseconds: Date.now()
  })
  
  const [timestampInput, setTimestampInput] = useState('')
  const [timestampUnit, setTimestampUnit] = useState('seconds')
  const [timestampFormat, setTimestampFormat] = useState(DATE_FORMATS[0].format)
  const [timestampResult, setTimestampResult] = useState('')
  const [timestampError, setTimestampError] = useState(null)
  
  const [dateInput, setDateInput] = useState('')
  const [dateFormat, setDateFormat] = useState(DATE_FORMATS[0].format)
  const [dateResult, setDateResult] = useState({ seconds: '', milliseconds: '' })
  const [dateError, setDateError] = useState(null)
  
  const [calcMode, setCalcMode] = useState('difference')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [calcResult, setCalcResult] = useState(null)
  const [calcError, setCalcError] = useState(null)
  
  const [opDate, setOpDate] = useState('')
  const [operation, setOperation] = useState('add')
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('days')
  const [opResult, setOpResult] = useState(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp({
        seconds: Math.floor(Date.now() / 1000),
        milliseconds: Date.now()
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!timestampInput.trim()) {
      setTimestampResult('')
      setTimestampError(null)
      return
    }

    const timestamp = parseInt(timestampInput)
    if (isNaN(timestamp)) {
      setTimestampError('请输入有效的数字')
      setTimestampResult('')
      return
    }

    try {
      let date
      if (timestampUnit === 'seconds') {
        date = new Date(timestamp * 1000)
      } else {
        date = new Date(timestamp)
      }

      if (isNaN(date.getTime())) {
        setTimestampError('无效的时间戳')
        setTimestampResult('')
        return
      }

      setTimestampResult(formatDate(date, timestampFormat))
      setTimestampError(null)
    } catch (e) {
      setTimestampError('转换失败，请检查输入')
      setTimestampResult('')
    }
  }, [timestampInput, timestampUnit, timestampFormat])

  useEffect(() => {
    if (!dateInput.trim()) {
      setDateResult({ seconds: '', milliseconds: '' })
      setDateError(null)
      return
    }

    try {
      const date = parseDate(dateInput, dateFormat)
      if (!date || isNaN(date.getTime())) {
        setDateError('无法解析日期，请检查格式是否匹配')
        setDateResult({ seconds: '', milliseconds: '' })
        return
      }

      setDateResult({
        seconds: Math.floor(date.getTime() / 1000),
        milliseconds: date.getTime()
      })
      setDateError(null)
    } catch (e) {
      setDateError('转换失败，请检查输入')
      setDateResult({ seconds: '', milliseconds: '' })
    }
  }, [dateInput, dateFormat])

  useEffect(() => {
    if (calcMode !== 'difference') return
    
    if (!startDate || !endDate) {
      setCalcResult(null)
      setCalcError(null)
      return
    }

    try {
      const start = new Date(startDate)
      const end = new Date(endDate)

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        setCalcError('请输入有效的日期')
        setCalcResult(null)
        return
      }

      const diffTime = Math.abs(end - start)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      let years = end.getFullYear() - start.getFullYear()
      let months = end.getMonth() - start.getMonth()
      let days = end.getDate() - start.getDate()
      
      if (days < 0) {
        months--
        const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0)
        days += lastMonth.getDate()
      }
      if (months < 0) {
        years--
        months += 12
      }
      
      if (years < 0 || months < 0 || days < 0) {
        years = Math.abs(years)
        months = Math.abs(months)
        days = Math.abs(days)
      }

      const diffMonths = years * 12 + months
      
      setCalcResult({
        days: diffDays,
        months: diffMonths,
        years: years,
        yearsMonthsDays: { years, months, days },
        hours: Math.floor(diffTime / (1000 * 60 * 60)),
        minutes: Math.floor(diffTime / (1000 * 60)),
        seconds: Math.floor(diffTime / 1000)
      })
      setCalcError(null)
    } catch (e) {
      setCalcError('计算失败，请检查输入')
      setCalcResult(null)
    }
  }, [startDate, endDate, calcMode])

  useEffect(() => {
    if (calcMode !== 'operation') return
    
    if (!opDate || !amount) {
      setOpResult(null)
      return
    }

    const numAmount = parseInt(amount)
    if (isNaN(numAmount)) {
      setOpResult(null)
      return
    }

    try {
      const date = new Date(opDate)
      if (isNaN(date.getTime())) {
        setOpResult(null)
        return
      }

      const resultDate = new Date(date)
      const multiplier = operation === 'add' ? 1 : -1

      switch (unit) {
        case 'days':
          resultDate.setDate(resultDate.getDate() + numAmount * multiplier)
          break
        case 'weeks':
          resultDate.setDate(resultDate.getDate() + numAmount * 7 * multiplier)
          break
        case 'months':
          resultDate.setMonth(resultDate.getMonth() + numAmount * multiplier)
          break
        case 'years':
          resultDate.setFullYear(resultDate.getFullYear() + numAmount * multiplier)
          break
      }

      if (isNaN(resultDate.getTime())) {
        setOpResult(null)
        return
      }

      setOpResult(formatDate(resultDate, 'YYYY-MM-DD HH:mm:ss'))
    } catch (e) {
      setOpResult(null)
    }
  }, [opDate, operation, amount, unit, calcMode])

  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard.writeText(String(text)).catch(err => {
        console.error('复制失败:', err)
      })
    }
  }

  return (
    <div className="datetime-tools">
      <div className="datetime-section">
        <h2 className="section-title">时间戳转换</h2>
        
        <div className="current-timestamp">
          <h3>当前时间戳</h3>
          <div className="timestamp-display">
            <div className="timestamp-item">
              <span className="timestamp-label">秒 (s):</span>
              <span className="timestamp-value">{currentTimestamp.seconds}</span>
              <button 
                className="copy-small-button"
                onClick={() => handleCopy(currentTimestamp.seconds)}
              >
                复制
              </button>
            </div>
            <div className="timestamp-item">
              <span className="timestamp-label">毫秒 (ms):</span>
              <span className="timestamp-value">{currentTimestamp.milliseconds}</span>
              <button 
                className="copy-small-button"
                onClick={() => handleCopy(currentTimestamp.milliseconds)}
              >
                复制
              </button>
            </div>
          </div>
        </div>

        <div className="converter-grid">
          <div className="converter-panel">
            <h3>时间戳 → 日期</h3>
            <div className="input-group">
              <label>输入时间戳</label>
              <div className="input-row">
                <input
                  type="text"
                  value={timestampInput}
                  onChange={(e) => setTimestampInput(e.target.value)}
                  placeholder="输入时间戳..."
                  className="datetime-input"
                />
                <select
                  value={timestampUnit}
                  onChange={(e) => setTimestampUnit(e.target.value)}
                  className="datetime-select"
                >
                  <option value="seconds">秒</option>
                  <option value="milliseconds">毫秒</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label>选择日期格式</label>
              <select
                value={timestampFormat}
                onChange={(e) => setTimestampFormat(e.target.value)}
                className="datetime-select"
              >
                {DATE_FORMATS.map((f) => (
                  <option key={f.format} value={f.format}>{f.label}</option>
                ))}
              </select>
            </div>
            <div className="result-group">
              <label>转换结果</label>
              <div className="result-display">
                <span className="result-text">{timestampResult || '-'}</span>
                {timestampResult && (
                  <button 
                    className="copy-small-button"
                    onClick={() => handleCopy(timestampResult)}
                  >
                    复制
                  </button>
                )}
              </div>
            </div>
            {timestampError && <div className="datetime-error">{timestampError}</div>}
          </div>

          <div className="converter-panel">
            <h3>日期 → 时间戳</h3>
            <div className="input-group">
              <label>输入日期</label>
              <input
                type="text"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                placeholder="输入日期，如: 2024-01-15 14:30:00"
                className="datetime-input"
              />
            </div>
            <div className="input-group">
              <label>选择日期格式</label>
              <select
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
                className="datetime-select"
              >
                {DATE_FORMATS.map((f) => (
                  <option key={f.format} value={f.format}>{f.label}</option>
                ))}
              </select>
            </div>
            <div className="result-group">
              <label>转换结果</label>
              <div className="timestamp-results">
                <div className="timestamp-result-item">
                  <span className="timestamp-result-label">秒:</span>
                  <span className="timestamp-result-value">{dateResult.seconds || '-'}</span>
                  {dateResult.seconds && (
                    <button 
                      className="copy-small-button"
                      onClick={() => handleCopy(dateResult.seconds)}
                    >
                      复制
                    </button>
                  )}
                </div>
                <div className="timestamp-result-item">
                  <span className="timestamp-result-label">毫秒:</span>
                  <span className="timestamp-result-value">{dateResult.milliseconds || '-'}</span>
                  {dateResult.milliseconds && (
                    <button 
                      className="copy-small-button"
                      onClick={() => handleCopy(dateResult.milliseconds)}
                    >
                      复制
                    </button>
                  )}
                </div>
              </div>
            </div>
            {dateError && <div className="datetime-error">{dateError}</div>}
          </div>
        </div>
      </div>

      <div className="datetime-section">
        <h2 className="section-title">日期计算</h2>
        
        <div className="calc-mode-toggle">
          <button
            className={`calc-mode-button ${calcMode === 'difference' ? 'active' : ''}`}
            onClick={() => setCalcMode('difference')}
          >
            日期差计算
          </button>
          <button
            className={`calc-mode-button ${calcMode === 'operation' ? 'active' : ''}`}
            onClick={() => setCalcMode('operation')}
          >
            日期加减
          </button>
        </div>

        {calcMode === 'difference' && (
          <div className="calc-panel">
            <div className="date-inputs">
              <div className="input-group">
                <label>开始日期</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="datetime-input"
                />
              </div>
              <div className="input-group">
                <label>结束日期</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="datetime-input"
                />
              </div>
            </div>

            {calcResult && (
              <div className="calc-results">
                <h3>计算结果</h3>
                <div className="result-grid">
                  <div className="result-card">
                    <span className="result-card-label">相差天数</span>
                    <span className="result-card-value">{calcResult.days} 天</span>
                  </div>
                  <div className="result-card">
                    <span className="result-card-label">相差月数</span>
                    <span className="result-card-value">{calcResult.months} 月</span>
                  </div>
                  <div className="result-card">
                    <span className="result-card-label">相差年数</span>
                    <span className="result-card-value">{calcResult.years} 年</span>
                  </div>
                  <div className="result-card">
                    <span className="result-card-label">详细</span>
                    <span className="result-card-value">
                      {calcResult.yearsMonthsDays.years}年 {calcResult.yearsMonthsDays.months}月 {calcResult.yearsMonthsDays.days}天
                    </span>
                  </div>
                </div>
                <div className="result-details">
                  <div className="detail-item">
                    <span className="detail-label">小时:</span>
                    <span className="detail-value">{calcResult.hours.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">分钟:</span>
                    <span className="detail-value">{calcResult.minutes.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">秒:</span>
                    <span className="detail-value">{calcResult.seconds.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
            {calcError && <div className="datetime-error">{calcError}</div>}
          </div>
        )}

        {calcMode === 'operation' && (
          <div className="calc-panel">
            <div className="operation-inputs">
              <div className="input-group">
                <label>基准日期</label>
                <input
                  type="date"
                  value={opDate}
                  onChange={(e) => setOpDate(e.target.value)}
                  className="datetime-input"
                />
              </div>
              <div className="input-group">
                <label>操作</label>
                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value)}
                  className="datetime-select"
                >
                  <option value="add">加</option>
                  <option value="subtract">减</option>
                </select>
              </div>
              <div className="input-group">
                <label>数量</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="输入数字"
                  className="datetime-input"
                  min="0"
                />
              </div>
              <div className="input-group">
                <label>单位</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="datetime-select"
                >
                  <option value="days">天</option>
                  <option value="weeks">周</option>
                  <option value="months">月</option>
                  <option value="years">年</option>
                </select>
              </div>
            </div>

            {opResult && (
              <div className="operation-result">
                <h3>计算结果</h3>
                <div className="result-display-large">
                  <span className="result-text-large">{opResult}</span>
                  <button 
                    className="copy-small-button"
                    onClick={() => handleCopy(opResult)}
                  >
                    复制
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default DateTimeTools