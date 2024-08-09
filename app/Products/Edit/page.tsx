'use client';

import Layout from "@/components/Layout";
import supabase from "@/app/lib/supabaseClient"; 
import ProductForm from "@/components/ProductForm";
import { useState } from "react";


export default function Edit({ searchParams }: { searchParams: { id: string } }) {
    const item_id = searchParams.id;

    const [item, setItem] = useState<any>(null);


const fetchItem = async () => {
            if (item_id) {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', item_id)
                    .single();

                if (error) {
                    console.error('Error fetching data:', error);
                
                } else {
                    setItem(data);
             
                }
            } 
        };

  fetchItem();
  
    if (!item) {
        return <div>Product not found</div>;
    }

    return (
        <Layout>
            Editing Product
            <ProductForm
                id={item.id}
                existing_title={item.name}
                existing_description={item.description}
                existing_price={item.price}
                existing_brand={item.brand_id}
                existing_category={item.category_id}
                existing_img={item.img_url}
            />
        </Layout>
    );
}
