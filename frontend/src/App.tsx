import { useState } from 'react'
import './App.css'
import { Bars3Icon } from '@heroicons/react/16/solid'
import { Outlet, Link} from 'react-router'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col">
        <div className="navbar bg-primary shadow-sm">
            <label htmlFor="drawer-1" className="btn btn-ghost drawer-button m-4 p-2">
                <Bars3Icon className="size-6" /> 
            </label>
        </div>
        <div className="drawer flex">
            <input id="drawer-1" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                <Outlet />
            </div>
            <div className="drawer-side">
                <label htmlFor="drawer-1" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                        <li><Link to="/dashboard">我的项目</Link></li>
                        <li><Link to="/chat">AI对话</Link></li>
                        <li><Link to="/database">数据检索</Link></li>
                        <li><Link to="/upload">数据上传</Link></li>
                    </ul>
            </div>
        </div>
    </div>
  )
}

export default App
