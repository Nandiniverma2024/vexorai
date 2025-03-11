import React from 'react'

const MainLayout = ({ children }) => {
  return (
    // If user is not on onboarding then, Redirect user to onboarding


    //Giving Some global style just for the (main) folder
    <div className='container mx-auto mt-24 mb-20'>{ children }</div>

  )
}

export default MainLayout
