'use client'
import { useState,useEffect } from "react";
import supabase from "@/app/lib/supabaseClient"; 
import { useRouter } from "next/navigation";


interface ProductFormProps {
    id?: number;
    existing_title?: string;
    existing_description?: string;
    existing_price?: string;
    existing_brand?: string;
    existing_category?: string;
    existing_img?: string;
}


export default function ProductForm({
    id ,
    existing_title = '',
    existing_description = '',
    existing_price = '',
    existing_brand = '',
    existing_category = '',
    existing_img = ''
}: ProductFormProps)
{
    const [title, setTitle] = useState(existing_title || '');
    const [price, setPrice] = useState(existing_price || '');
    const [description, setDescription] = useState(existing_description || '');
    const [img_url, setImg_url] = useState(existing_img || '');
    const [brands, setBrands] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedBrand, setSelectedBrand] = useState(existing_brand || '');
    const [selectedCategory, setSelectedCategory] = useState(existing_category || '');
    const router = useRouter();

   
useEffect(() => {
const fetchData = async () => {
            // Fetch categories
            try {
                const { data, error } = await supabase.from('categories').select('*');
                if (error) {
                    throw error;
                }
                const formattedData = data.map(item => ({
                    id: item.id,
                    name: item.name,
                }));
                setCategories(formattedData);
            } catch (error) {
                console.log("Error fetching categories:", error);
            }

            // Fetch brands
            try {
                const { data, error } = await supabase.from('brand').select('*');
                if (error) {
                    throw error;
                }
                const formattedData2 = data.map(item => ({
                    id: item.id,
                    name: item.name,
                }));
                setBrands(formattedData2);
            } catch (error) {
                console.log("Error fetching brands:", error);
            } 

            if (id){
                setTitle(existing_title);
                setPrice(existing_price);
                setSelectedBrand(existing_brand);
                setSelectedCategory(existing_category);
                setImg_url(existing_img);
                setDescription(existing_description);
            }
        };
        fetchData();
       
    }, [id, existing_title, existing_price, existing_brand, existing_category, existing_img, existing_description]);



const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
    
        try {
            if (id) {
                console.log(id)
                const { data, error } = await supabase
                    .from('products')
                    .update({
                        name: title,
                        price: price,
                        category_id: selectedCategory,
                        brand_id: selectedBrand,
                        img_url: img_url,
                        description: description,
                    })
                    .eq('id', id)
                    .select();
                if (error) throw error;
                console.log("Product updated:", data);

            } else {
                const { data, error } = await supabase
                    .from('products')
                    .insert([
                        {
                            name: title,
                            price: price,
                            category_id: selectedCategory,
                            brand_id: selectedBrand,
                            img_url :img_url,
                            description :description,
                        },
                    ])
                    .select();
                if (error) throw error;
                console.log("Product inserted:", data);
            }
            
            // Clear form and redirect
            setTitle('');
            setPrice('');
            setSelectedBrand('');
            setSelectedCategory('');
            setDescription('');
            setImg_url('');
            router.push('/Products');
        } catch (error) {
          
            console.error("Error saving data:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Product name</label>
            <input
                type="text"
                placeholder="New Product"
                value={title}
                onChange={e => setTitle(e.target.value)}
            />

            <label>Description</label>
            <input
                type="text"
                placeholder="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />

            <label>Brand</label>
            <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
            >
                <option value="" disabled>Select Brand</option>
                {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                        {brand.name}
                    </option>
                ))}
            </select>

            <label>Category</label>
            <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
            >
                <option value="" disabled>Select Category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>

            <label>Img URL</label>
            <input
                type="text"
                placeholder="url for your products img"
                value={img_url}
                onChange={e => setImg_url(e.target.value)}
            />

            <label>Price in USD</label>
            <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={e => setPrice(e.target.value)}
            />

            <button type="submit" className="btn-primary">Save</button>
        </form>
    );
}
