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


import { Container } from '../Container/Container'


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


const Footer = (props) => {

  const user = useContext(AuthedUserContext);
  const location = useLocation()
  const navigate = useNavigate();

  return (
    <header className='w-full '>
      <footer className= 'w-full'>
        <Container className={`relative z-50 flex ${
            user ? 'justify-between' : 'justify-center'
          } py-6 w-full`}
        >
        
        </Container>
      </footer>
    </header> 
  )
}

export default Footer
