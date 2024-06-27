import React, { useState } from 'react';
import Sidebar from './Sidebar/index';
import { Outlet } from 'react-router-dom';
import SSEProvider from '../SSEProvider';

const DefaultLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  

  return (
    <SSEProvider>
      <div>
        {/* <!-- ===== Page Wrapper Start ===== --> */}
        <div className="flex h-screen overflow-hidden">
          {/* <!-- ===== Sidebar Start ===== --> */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Sidebar End ===== --> */}

          {/* <!-- ===== Content Area Start ===== --> */}
          <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">

            {/* <!-- ===== Main Content Start ===== --> */}
            <main>
              <div className="mx-auto bg-slate-900">
                <Outlet />
              </div>
            </main>
            {/* <!-- ===== Main Content End ===== --> */}
          </div>
          {/* <!-- ===== Content Area End ===== --> */}
        </div>
        {/* <!-- ===== Page Wrapper End ===== --> */}
      </div>
    </SSEProvider>
  );
};

export default DefaultLayout;
