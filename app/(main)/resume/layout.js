import React from 'react'
import { Suspense } from 'react';
import { BarLoader } from 'react-spinners';

const Layout = ({children}) => {
  return (
    <div className='px-5'>
        <Suspense 
            fallback={<BarLoader className='mt-4' width={"100%"} color="gray"/>}
        >
            {children} {/* Make an API call inside page.jsx , that will we fetch on our server*/}
        </Suspense>
    </div>
  );
}

export default Layout
