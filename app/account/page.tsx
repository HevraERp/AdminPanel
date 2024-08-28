import orders from '../orders/page';
import AccountForm from './account-form';
import { createClient } from '@/utils/supabase/server';

export default async function Account() {
  const supabase = createClient();

  // Fetch clients
  const { data: clients, error: clientError } = await supabase.from('clients').select('id');
  if (clientError) {
    console.log('Error while fetching client data: ' + clientError.message);
  }
  const usersnumber = clients ? clients.length : 0;

  // Fetch products
  const { data: Products, error: ProductError } = await supabase.from('products').select('id');
  if (ProductError) {
    console.log('Error while fetching product data: ' + ProductError.message);
  }
  const ProductNumber = Products ? Products.length : 0;

  // Fetch categories
  const { data: Category, error: CategoryError } = await supabase.from('categories').select('id');
  if (CategoryError) {
    console.log('Error while fetching category data: ' + CategoryError.message);
  }
  const CategoryNumber = Category ? Category.length : 0;


// Fetching orders
const { data: Orders, error: OrderError } = await supabase.from('orders').select('status');
if (OrderError) {
  console.log('Error while fetching order data: ' + OrderError.message);
}

let PendingNumber = 0;
let CompletedNumber = 0;


if (Orders) {
  Orders.forEach(order => {
    if (order.status === 'pending') {
      PendingNumber++;
    } else if (order.status === 'completed') {
      CompletedNumber++;
    }
  });
}

  // Fetch user data
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col  items-center justify-start min-h-screen mt-0 mx-4 sm:mx-16">
      
   
      <div className="w-full max-w-2xl mb-8">
        <AccountForm user={user} />
      </div>


      <div className="flex flex-wrap justify-center w-full max-w-2xl mb-8 gap-8">
        <div className="flex-1 min-w-[250px] bg-white p-8 sm:p-16 rounded-lg shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Users</h2>
          <p className="text-gray-700 mt-4 text-sm sm:text-base">{usersnumber}</p>
          
        </div>

        <div className="flex-1 min-w-[250px] bg-white p-8 sm:p-16 rounded-lg shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Products</h2>
          <p className="text-gray-700 mt-4 text-sm sm:text-base">{ProductNumber}</p>
        </div>
      </div>

  
      <div className="flex flex-wrap justify-center w-full max-w-2xl gap-8">
        <div className="flex-1 min-w-[250px] bg-white p-8 sm:p-16 rounded-lg shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Orders</h2>
          <p className="text-gray-700 mt-4 text-sm sm:text-base">Completed  {CompletedNumber}</p>
          <p className="text-gray-700 mt-2 text-sm sm:text-base">Pending  {PendingNumber}</p>
        </div>

        <div className="flex-1 min-w-[250px] bg-white p-8 sm:p-16 rounded-lg shadow-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Category</h2>
          <p className="text-gray-700 mt-4 text-sm sm:text-base">{CategoryNumber}</p>
        </div>
      </div>

    </div>
  );
}
