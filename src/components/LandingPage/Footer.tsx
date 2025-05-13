import React from 'react'

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 gap-y-8 md:gap-8 py-10 max-w-sm mx-auto sm:max-w-3xl lg:max-w-full">
          <div className="col-span-full mb-10 lg:col-span-2 lg:mb-0">
            <a href="https://pagedone.io/" className="flex justify-center items-center lg:justify-start">
              <img
                src="https://i.ibb.co/QFh5dS8r/images-1.png"
                alt="DILG Logo"
                className="w-16 h-16 object-cover rounded-full"
              />
              <span className="ml-2 font-bold text-black dark:text-white">DILG Calapan</span>
            </a>
            <p className="py-8 text-sm text-gray-500 dark:text-gray-400 lg:max-w-xs text-center lg:text-left">
              1st Floor, Local Government Center New City Hall Complex, M. Roxas Drive Barangay, Calapan, 5200 Oriental Mindoro
            </p>
            <a href="#" className="py-2.5 px-5 h-9 block w-fit bg-indigo-600 rounded-full shadow-sm text-xs text-white mx-auto transition-all duration-500 hover:bg-indigo-700 lg:mx-0">
              Contact us
            </a>
          </div>

          {[
            {
              title: 'DILG',
              links: ['Home', 'About', 'Features']
            },
            {
              title: 'Products',
              links: ['AI Reporting System', 'Real-Time Analytics', 'Digital Document Management']
            },
            {
              title: 'Support',
              links: ['Help Center', 'Terms & Conditions', 'Privacy Policy']
            }
          ].map((section, i) => (
            <div key={i} className="lg:mx-auto text-left">
              <h4 className="text-lg font-medium mb-7 text-gray-900 dark:text-white">{section.title}</h4>
              <ul className="text-sm transition-all duration-500">
                {section.links.map((link, j) => (
                  <li key={j} className="mb-6 last:mb-0">
                    <a href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="lg:mx-auto text-left">
            <h4 className="text-lg font-medium mb-7 text-gray-900 dark:text-white">Stay Updated</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-6 mb-7">
              Subscribe for the latest updates on smart governance solutions for Calapan
            </p>
            <a href="#" className="flex items-center justify-center gap-2 border border-indigo-600 rounded-full py-3 px-6 w-fit text-sm text-indigo-600 font-semibold transition-all duration-500 hover:bg-indigo-50 dark:hover:bg-indigo-800 dark:border-indigo-400 dark:text-indigo-300">
              Subscribe
              <svg width="15" height="12" viewBox="0 0 15 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.25 6L13.25 6M9.5 10.5L13.4697 6.53033C13.7197 6.28033 13.8447 6.15533 13.8447 6C13.8447 5.84467 13.7197 5.71967 13.4697 5.46967L9.5 1.5" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>

        <div className="py-7 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center flex-col lg:justify-between lg:flex-row">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              © <a href="https://pagedone.io/">DILG</a> Calapan, All rights reserved.
            </span>
            <div className="flex mt-4 space-x-4 sm:justify-center lg:mt-0">
              <a href="#" className="w-8 h-8 rounded-full flex justify-center items-center bg-[#33CCFF] hover:bg-gray-900 transition-all">
                {/* Twitter-style icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="white">
                  <path d="M11.3214 8.93666L16.4919 3.05566H15.2667L10.7772 8.16205L7.1914 3.05566H3.05566L8.47803 10.7774L3.05566 16.9446H4.28097L9.022 11.552L12.8088 16.9446H16.9446L11.3211 8.93666Z" />
                </svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full flex justify-center items-center bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 hover:bg-gray-900 transition-all">
                {/* Instagram-style icon */}
                <svg className="w-5 h-[1.125rem] text-white" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5.63434 7.99747C5.63434 6.69062 6.6941 5.63093 8.00173 5.63093C9.30936 5.63093 10.3697 6.69062 10.3697 7.99747C10.3697 9.30431 9.30936 10.364 8.00173 10.364C6.6941 10.364 5.63434 9.30431 5.63434 7.99747Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
