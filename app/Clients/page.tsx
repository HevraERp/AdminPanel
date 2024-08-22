'use client'
import Layout from "@/components/Layout";
import { supabase } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";


export default function Brands() {
  const [data, setData] = useState<any[]>([]);
  const [totalPage, setTotalPage] = useState(1);


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
      const { data, error,count } = await supabase
      .from('clients')
      .select('*', {count: 'exact' })
      .eq('user_role','client')
      .ilike('username', `%${debouncedText}%`)
      .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

      ;
      if (error) {
        throw error;
      }
       
      const formattedData = data.map(item => ({
        _id: item.id,
        user_name: item.username,
        email: item.email,
      }));
      setData(formattedData);
      const totalItems = count ?? 0;
      setTotalPage(Math.ceil(totalItems / itemsPerPage));

      
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedText, currentPage]);

  
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
      <h1 className="mt-4">Clients</h1>
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
            <td>Clients name</td>
            <td>Clients email</td>
          </tr>
        </thead>
        <tbody>
          {data.map(users => (
            <tr key={users._id}>
              <td className="text-black border">{users.user_name}</td>
              <td className="text-black border">{users.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination mt-4">
        {Array.from({ length: totalPage }, (_, index) => (
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
