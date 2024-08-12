"use client";
import { useState, useEffect, ChangeEvent } from "react";
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
  id,
  existing_title = "",
  existing_description = "",
  existing_price = "",
  existing_brand = "",
  existing_category = "",
  existing_img = "",
}: ProductFormProps) {
  const [title, setTitle] = useState(existing_title || "");
  const [price, setPrice] = useState(existing_price || "");
  const [description, setDescription] = useState(existing_description || "");
  const [img_url, setImg_url] = useState(existing_img || "");
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState(existing_brand || "");
  const [selectedCategory, setSelectedCategory] = useState(
    existing_category || ""
  );
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch categories
      try {
        const { data, error } = await supabase.from("categories").select("*");
        if (error) {
          throw error;
        }
        const formattedData = data.map((item) => ({
          id: item.id,
          name: item.name,
        }));
        setCategories(formattedData);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }

      // Fetch brands
      try {
        const { data, error } = await supabase.from("brand").select("*");
        if (error) {
          throw error;
        }
        const formattedData2 = data.map((item) => ({
          id: item.id,
          name: item.name,
        }));
        setBrands(formattedData2);
      } catch (error) {
        console.log("Error fetching brands:", error);
      }

      if (id) {
        setTitle(existing_title);
        setPrice(existing_price);
        setSelectedBrand(existing_brand);
        setSelectedCategory(existing_category);
        setImg_url(existing_img);
        setDescription(existing_description);
      }
    };
    fetchData();
  }, [
    id,
    existing_title,
    existing_price,
    existing_brand,
    existing_category,
    existing_img,
    existing_description,
  ]);

  const handleFileInputChange = async ( event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setImg_url(localUrl);

    const { data, error } = await supabase.storage
      .from("Images")
      .upload(`${file.name}`, file);

    if (error) {
      console.error("Error uploading file:", error);
      return;
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    try {
      if (id) {
        console.log(id);
        const { data, error } = await supabase
          .from("products")
          .update({
            name: title,
            price: price,
            category_id: selectedCategory,
            brand_id: selectedBrand,
            img_url: img_url,
            description: description,
          })
          .eq("id", id)
          .select();
        if (error) throw error;
        console.log("Product updated:", data);
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert([
            {
              name: title,
              price: price,
              category_id: selectedCategory,
              brand_id: selectedBrand,
              img_url: img_url,
              description: description,
            },
          ])
          .select();
        if (error) throw error;
        console.log("Product inserted:", data);
      }

      // Clear form and redirect
      setTitle("");
      setPrice("");
      setSelectedBrand("");
      setSelectedCategory("");
      setDescription("");
      setImg_url("");
      router.push("/Products");
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
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Description</label>
      <input
        type="text"
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Brand</label>
      <select
        value={selectedBrand}
        onChange={(e) => setSelectedBrand(e.target.value)}
      >
        <option value="" disabled>
          Select Brand
        </option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>

      <label>Category</label>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="" disabled>
          Select Category
        </option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <label>Photos</label>
      <div className="relative mb-4 w-24 h-24">
        <label className="w-full h-full cursor-pointer flex justify-center items-center text-gray-500 rounded-lg bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Upload</div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </label>

        {img_url && (
          <img
            src={img_url}
            alt="Preview"
            className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
          />
        )}
      </div>

      <label>Price in USD</label>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
