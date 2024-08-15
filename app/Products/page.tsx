'use client'

import Link from "next/link";
import Layout from "@/components/Layout";
import {createClient} from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";


export default function Products() {
  
  const supabase = createClient();
  const [data, setData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);

    // to handle search functionality
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const [query, setQuery] = useState(searchParams?.get('query') || "");
   const [debouncedText] = useDebounce(query, 400);
  
  // handle pagination
  const currentPage = Number(searchParams?.get('page')) || 1;
  const itemsPerPage = 4; 

  const fetchData = async () => {
    try {
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .ilike('name', `%${debouncedText}%`)
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      if (error) {
        throw error;
      }

      const formattedData = data.map(item => ({
        _id: item.id,
        title: item.name,
        price: item.price,
        image: item.img_url,
        description: item.description,

      }));
      setData(formattedData);

      const totalItems = count ?? 0;
      setTotalPages(Math.ceil(totalItems / itemsPerPage));


    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedText, currentPage]);

  async function DeleteProduct(item_id: Number) {
    if (item_id) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', item_id);

      if (error) {
        console.error('Error deleting data:', error);
      } else {
        fetchData();
      }
    }
  }

  const handleDelete = (item_id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteProduct(item_id);
      }
    });
  }

  const handleSearch = (term: string) => {
    setQuery(term)
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
      params.set('page', '1'); 
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <Layout>
      <Link className="btn-primary " href={'/Products/New'}>Add new product</Link>
      <input 
        className="mt-4"
        placeholder="Search"
        onChange={(e) => {
          handleSearch(e.target.value)
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />

      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Product Image</td>
            <td>Product name</td>
            <td>Product Description</td>
            <td>Product Price</td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {data.map(product => (
            <tr key={product._id}>
             <td className="text-black"><img  className ="product-image" src={product.image} /></td>
              <td className="text-black">{product.title}</td>
              <td className="text-black">{product.description}</td>
              <td className="text-black">{product.price}</td>
              <td>
                <Link className="btn-default" href={{
                  pathname: '/Products/Edit/',
                  query: { id: product._id }
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                  Edit
                </Link>
              </td>
              <td>
                <button className="btn-primary flex" onClick={() => handleDelete(product._id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-4 mt-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => goToPage(index + 1)}
            className={`btn ${currentPage === index + 1 ? 'btn-primary' : 'btn-default'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </Layout>
  );
}
