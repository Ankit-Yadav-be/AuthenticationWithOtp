
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { extendTheme, ChakraProvider } from '@chakra-ui/react'
import { UserProvider } from './context/userContext.jsx'


const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

createRoot(document.getElementById('root')).render(
 <ChakraProvider theme={theme}>
      <UserProvider>
        <App />
      </UserProvider>
    </ChakraProvider>
)
