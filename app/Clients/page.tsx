'use client'
import Layout from "@/components/Layout";
import {createClient} from "@/utils/supabase/client";
import { useState } from "react";


export default function brands(){
  const supabase = createClient()
  const [data, setData] = useState<any[]>([]);
  const fetchData = async () => {
    // Fetch data
    try {
      const { data, error } = await supabase.from('clients').select('*');
      if (error) {
        throw error;
      }

      const formattedData = data.map(item => ({
        _id: item.id,
        user_name: item.username,
        email:item.email,
      }));
      setData(formattedData);
    } catch (error) {
      console.log("erro");
    } 
  };
  fetchData();

return(

        <Layout>
     <h1 className="mt-4">Clients</h1>
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
                <td className="text-black border">{users.user_name} </td>
                <td className="text-black border">{users.email} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Layout>
    )
}
    