import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Home from './pages/Home'
import PythonPage from './pages/PythonPage'
import JavaScriptPage from './pages/JavaScriptPage'
import CPage from './pages/CPage'
import CppPage from './pages/CppPage'
import ReactPage from './pages/ReactPage'
import MongoPage from './pages/MongoPage'
import MatlabPage from './pages/MatlabPage'
import DockerPage from './pages/DockerPage'
import KubernetesPage from './pages/KubernetesPage'
import LinuxPage from './pages/LinuxPage'
import GitPage from './pages/GitPage'
import JavaPage from './pages/JavaPage'
import ComparisonPage from './pages/ComparisonPage'
import RustPage from './pages/RustPage'
import ZigPage from './pages/ZigPage'
import RedisPage from './pages/RedisPage'
import PythonStdlibPage from './pages/PythonStdlibPage'
import NetworkingPage from './pages/NetworkingPage'
import WebProtocolsPage from './pages/WebProtocolsPage'
import DistributedSystemsPage from './pages/DistributedSystemsPage'
import BackendPage from './pages/BackendPage'
import IoTPage from './pages/IoTPage'
import EmbeddedPage from './pages/EmbeddedPage'
import ArduinoPage from './pages/ArduinoPage'
import RaspberryPiPage from './pages/RaspberryPiPage'

export default function App() {
  return (
    <>
      <Header />
      <div className="layout">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/java" element={<JavaPage />} />
            <Route path="/python" element={<PythonPage />} />
            <Route path="/javascript" element={<JavaScriptPage />} />
            <Route path="/c" element={<CPage />} />
            <Route path="/cpp" element={<CppPage />} />
            <Route path="/react" element={<ReactPage />} />
            <Route path="/mongodb" element={<MongoPage />} />
            <Route path="/matlab" element={<MatlabPage />} />
            <Route path="/docker" element={<DockerPage />} />
            <Route path="/kubernetes" element={<KubernetesPage />} />
            <Route path="/linux" element={<LinuxPage />} />
            <Route path="/git" element={<GitPage />} />
            <Route path="/rust" element={<RustPage />} />
            <Route path="/zig" element={<ZigPage />} />
            <Route path="/redis" element={<RedisPage />} />
            <Route path="/python-stdlib" element={<PythonStdlibPage />} />
            <Route path="/networking" element={<NetworkingPage />} />
            <Route path="/web-protocols" element={<WebProtocolsPage />} />
            <Route path="/distributed-systems" element={<DistributedSystemsPage />} />
            <Route path="/backend" element={<BackendPage />} />
            <Route path="/iot" element={<IoTPage />} />
            <Route path="/embedded" element={<EmbeddedPage />} />
            <Route path="/arduino" element={<ArduinoPage />} />
            <Route path="/raspberry-pi" element={<RaspberryPiPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
          </Routes>
        </main>
      </div>
    </>
  )
}
