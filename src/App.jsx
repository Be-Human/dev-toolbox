import { useState } from 'react'
import './App.css'
import JsonFormatter from './components/JsonFormatter'
import RegexTester from './components/RegexTester'
import Base64Codec from './components/Base64Codec'

function App() {
  const [activeTab, setActiveTab] = useState('json-formatter')
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <header className="app-header">
        <h1>开发者工具箱</h1>
        <button 
          className="theme-toggle" 
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? '🌞' : '🌙'}
        </button>
      </header>
      
      <nav className="tab-nav">
        <button 
          className={`tab-button ${activeTab === 'json-formatter' ? 'active' : ''}`}
          onClick={() => setActiveTab('json-formatter')}
        >
          JSON 格式化器
        </button>
        <button 
          className={`tab-button ${activeTab === 'todo' ? 'active' : ''}`}
          onClick={() => setActiveTab('todo')}
        >
          TODO 列表
        </button>
        <button 
          className={`tab-button ${activeTab === 'regex' ? 'active' : ''}`}
          onClick={() => setActiveTab('regex')}
        >
          正则表达式测试器
        </button>
        <button 
          className={`tab-button ${activeTab === 'base64' ? 'active' : ''}`}
          onClick={() => setActiveTab('base64')}
        >
          Base64 编解码
        </button>
      </nav>
      
      <main className="app-content">
        {activeTab === 'json-formatter' && <JsonFormatter />}
        {activeTab === 'todo' && <div className="placeholder">TODO 列表工具开发中...</div>}
        {activeTab === 'regex' && <RegexTester />}
        {activeTab === 'base64' && <Base64Codec />}
      </main>
    </div>
  )
}

export default App
