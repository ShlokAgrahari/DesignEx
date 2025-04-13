export default function WorkPage() {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="w-60 bg-[#111] flex flex-col items-center py-6 border-r border-white">
        <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center text-lg font-bold mb-10">
          logo
        </div>
        <nav className="flex flex-col space-y-6 text-lg font-light">
          <a href="#">home</a>
          <a href="#">templates</a>
          <a href="#">my designs</a>
          <a href="#">my teams</a>
          <a href="#">apps</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white pb-4 mb-6">
          <div>
            <h1 className="text-xl font-semibold">Team Name</h1>
            <p className="text-sm text-gray-300">team leader</p>
            <p className="text-sm text-gray-300">team code</p>
          </div>
          <button className="border border-white px-4 py-2 rounded hover:bg-white hover:text-black transition">
            VC join/start
          </button>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 gap-6 border border-white p-6 rounded">
          {/* Participants Box */}
          <div className="flex-1 border border-white p-4 rounded">
            <h2 className="text-lg font-medium mb-4">participants-</h2>
            <ul className="space-y-2">
              <li>__________</li>
              <li>__________</li>
            </ul>
          </div>

          {/* Project Box */}
          <div className="flex-1 border border-white p-4 rounded flex flex-col items-center">
            <div className="w-full h-48 bg-gray-700 mb-4 flex items-center justify-center rounded">
              project pic
            </div>
            <p className="text-center">project title</p>
          </div>
        </div>
      </div>
    </div>
  );
}
