import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Home from './components/Home/Home.jsx'
import UploadCategory from './components/Upload/UploadCategory.jsx'
import UploadProdcut from './components/Upload/UploadProdcut.jsx'
import Product from './components/Product/Product.jsx'
import SearchResults from './components/Search/SearchResult.jsx'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    <Route path='' element={<Home />} />
    <Route path='/upload/category' element={<UploadCategory />} />
    <Route path='/upload/product' element={<UploadProdcut />} />
    <Route path='/product/:id' element={<Product />} />
    <Route path='/search' element={<SearchResults />} />
  </Route>
))


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
