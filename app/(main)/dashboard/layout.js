import React from 'react'
import { Suspense } from 'react';
import { BarLoader } from 'react-spinners';

const Layout = ({children}) => {
  return (
    <div className='px-5'>
        <div className='flex items-center justify-between mb-5'>
            <h1 className='text-6xl font-bold gradient-title'>Industry Insights</h1>
        </div>
        {/* we want to show some suspence until it is fetched(we want to show some loading indicator) */}
        <Suspense 
            fallback={<BarLoader className='mt-4' width={"100%"} color="gray"/>}
        >
            {children} {/* Make an API call inside page.jsx , that will we fetch on our server*/}
        </Suspense>
    </div>
  );
}

export default Layout
