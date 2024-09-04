'use client'
import {useContext} from 'react'
import { AuthedUserContext } from '../../../App';

import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'

// import { Button } from '@/components/Button'
import { Container } from '../Container/Container'
// import { Logo } from '@/components/Logo'
import { NavLinks } from './NavLinks'

import CardLogo from '../Logo/Logo'
import PlaceholderIcon from '../Logo/PlaceholderIcon'
import { 
  // ArrowLeftStartOnRectangleIcon,
  HomeIcon, 
} from '@heroicons/react/16/solid'

import { 
  ArrowLeftStartOnRectangleIcon,
  // HomeIcon, 
} from '@heroicons/react/24/outline'

import { Button } from '../../template/button'

import styles from './NavBar.module.css'


function MenuIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}


function ChevronUpIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M17 14l-5-5-5 5"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MobileNavLink(props) {
  return (
    <PopoverButton
      as={Link}
      className="block text-base leading-7 tracking-tight text-gray-700"
      {...props}
    />
  )
}



const NavBar = (props) => {

  const user = useContext(AuthedUserContext);
  const location = useLocation()
  const navigate = useNavigate();

  return (
    <header className='w-full'>
      <nav className= 'w-full'>
        <Container className={`relative z-50 flex ${
            user ? 'justify-between' : 'justify-center'
          } py-6 w-full`}
        >
          <div className="relative z-10 flex items-center gap-16">
            
           <PlaceholderIcon className='w-48'/>
            
            
          </div>

          {user && (
            location.pathname === '/dashboard' ? (
              <ArrowLeftStartOnRectangleIcon
                className="flex items-center h-8 w-8 text-green-700"
                onClick={() => {
                  props.handleSignout();
                  close(); // Close the Popover after sign out
                }}
              />
            ) : (
              <HomeIcon
                className="h-7 w-7 text-green-700"
                onClick={() => {
                  navigate('/dashboard')
                }}
              />
            )
          )}


             {/* <div className="flex items-center gap-6">
               <Popover className="lg:hidden">
               <Popover>
                 {({ open, close }) => ( */
            //       <>
            //         <PopoverButton
            //           className="relative z-10 -m-2 inline-flex items-center rounded-lg stroke-gray-900 p-2 hover:bg-gray-200/50 hover:stroke-gray-600 active:stroke-gray-900 ui-not-focus-visible:outline-none"
            //           aria-label="Toggle site navigation"
            //         >
            //           {({ open }) =>
            //             open ? (
            //               <ChevronUpIcon className="h-6 w-6" />
            //             ) : (
            //               <MenuIcon className="h-6 w-6" />
            //             )
            //           }
            //         </PopoverButton>
            //         <AnimatePresence initial={false}>
            //           {open && (
            //             <>
            //               <PopoverBackdrop
            //                 static
            //                 as={motion.div}
            //                 initial={{ opacity: 0 }}
            //                 animate={{ opacity: 1 }}
            //                 exit={{ opacity: 0 }}
            //                 className="fixed inset-0 z-0 bg-gray-300/60 backdrop-blur"
            //               />
            //               <PopoverPanel
            //                 static
            //                 as={motion.div}
            //                 initial={{ opacity: 0, y: -32 }}
            //                 animate={{ opacity: 1, y: 0 }}
            //                 exit={{
            //                   opacity: 0,
            //                   y: -32,
            //                   transition: { duration: 0.2 },
            //                 }}
            //                 className="absolute inset-x-0 top-0 z-0 origin-top rounded-b-2xl bg-gray-50 px-6 pb-6 pt-32 shadow-2xl shadow-gray-900/20"
            //               >
            //                 <div className="space-y-4">
            //                 <MobileNavLink to="/dashboard">
            //                     Dashboard
            //                   </MobileNavLink>
            //                   <MobileNavLink to="/game/count-single">
            //                     Game Count Single
            //                   </MobileNavLink>
            //                   {/* <MobileNavLink href="/#pricing">
            //                     Pricing
            //                   </MobileNavLink> */}
            //                   <MobileNavLink href="/#faqs">FAQs</MobileNavLink>
            //                 </div>
            //                 <div className="mt-8 flex flex-col gap-4">

            //                   <Button
            //                     type="submit"
            //                     color="green"
            //                     onClick={() => {
            //                       props.handleSignout();
            //                       close(); // Close the Popover after sign out
            //                     }}
            //                     className='w-full'
            //                     >
            //                     Sign Out
            //                   </Button>
                              
                              
            //                   {/* <Button href="#">Download the app</Button> */}
            //                 </div>
            //               </PopoverPanel>
            //             </>
            //           )}
            //         </AnimatePresence>
            //       </>
            //     )}
            //   </Popover>
            //   {/* <Button href="/login" variant="outline" className="hidden lg:block">
            //     Log in
            //   </Button>
            //   <Button href="#" className="hidden lg:block">
            //     Download
            //   </Button> */}
            // </div>
            }
          
        </Container>
      </nav>
    </header> 
  )
}

export default NavBar
