'use client'
import Layout from "@/components/Layout";
import supabase from "@/app/lib/supabaseClient"; 
import { useState } from "react";
import Swal from 'sweetalert2';

interface Brand {
  _id: number;
  title: string;
}


export default function brands(){

    const [data, setData] = useState<any[]>([]);
    const [brandName, setBrandName] = useState('')
    const [editedBrand , setEditedBrand] = useState<Brand | null>(null);


const fetchData = async () => {
  // Fetch data
  try {
    const { data, error } = await supabase.from('brand').select('*');
    if (error) {
      throw error;
    }

    const formattedData = data.map(item => ({
      _id: item.id,
      title: item.name,
    }));
    setData(formattedData);
  } catch (error) {
    console.log("erro");
  } 
};
fetchData();



async function createBrand(event: { preventDefault: () => void; }) {
        event.preventDefault();

        if (editedBrand) {
          const { error } = await supabase
              .from('brand')
              .update({ name: brandName })
              .eq('id', editedBrand._id);

          if (error) {
              console.error('Error updating data:', error);
          } else {
              setEditedBrand(null);
          }
      } else {
               // Insert new Brand
               const { error } = await supabase
               .from('brand')
               .insert([
                   {
                       name: brandName,
                   },
               ])
               .select();

          if (error) {
              console.error("Error inserting data:", error);
          }
      }
      setBrandName('');
  };

async function   DeleteBrand(item_id :Number){
    if (item_id) {
          const { error } = await supabase
            .from('brand') 
            .delete()
            .eq('id', item_id);
  
          if (error) {
            console.error('Error deleting data:', error);
          } 
        }
      
    }

    async function EditCategory(product: Brand){
      setEditedBrand(product)
      setBrandName(product.title)
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
            DeleteBrand(item_id);
          }
        });
      }

return(

        <Layout>
     <h1 className="mt-4">Brands</h1>

    <label>{editedBrand ? 'Edit Brand ' : 'Create New Brand'  }</label> 
        <form onSubmit={createBrand}>
                <input
                    type='text'
                    placeholder="New Brand"
                    value={brandName}
                    onChange={e => setBrandName(e.target.value)}
                />
                 <button type="submit" className="btn-primary">Save</button>
          </form>
        
        <table className="basic mt-2">
          <thead>
            <tr>
              <td>Brands name</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {data.map(product => (
              <tr key={product._id}>
                <td className="text-black border">{product.title} </td>
                <td className="flex">
                  <button className="btn-default mr-3 flex"  onClick= { () => EditCategory(product)} >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mt-1 ">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                    Edit
                  </button>
           
                  <button className="btn-primary flex" onClick= { () => handleDelete(product._id)}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}  stroke="currentColor" className="w-6 h-4 mt-1 ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Layout>
    )
}
    