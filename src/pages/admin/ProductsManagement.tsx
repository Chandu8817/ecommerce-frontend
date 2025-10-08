import { useEffect, useState } from "react";

import { useProducts } from "../../hooks/api/useProducts";
import AddProductModal from "./AddProductModal";
export function ProductsManagement() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [take] = useState(10); // rows per page
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [isBulk, setIsBulk] = useState(false);

  const { getPaginatedProducts,getTotalCount , deleteProduct ,deleteProducts,updateProduct,updateProducts} = useProducts();

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);


  useEffect(() => {
    getTotalCount().then((data) => {
      setTotal(data as unknown as number);
    });    
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [take,page,total]);


      const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getPaginatedProducts(page,take);
      const data = await response.data;
      setProducts(data.items || data); // adjust if API returns differently
      const totalCount = await getTotalCount();
      setTotal(totalCount as unknown as number); // assume API gives total count
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
    
      deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleUpdate = (id: string) => {
    updateProduct(id, { name: "Updated Product" });
    // navigate to edit page or open modal
  };

  const handleAdd = () => {
    setOpen(true);
    // navigate to add product page or open modal
  };

  const handleBulkUpload = () => {
    setOpen(true);
    setIsBulk(true);
    // navigate to bulk upload page or open modal
  };


    // Toggle individual product selection
    const toggleSelect = (id: string) => {
      
      setSelectedProducts((prev) =>
        prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
      );
    };
  
    // Toggle all products selection
    const toggleSelectAll = () => {
      if (selectAll) {
        // Deselect all - clear the selected products
        setSelectedProducts([]);
      } else {
        // Select all - add all product ids to selectedProducts
        const allProductIds = products.map((p: any) => p.id || p._id).filter(Boolean);
        setSelectedProducts(allProductIds);
      }
      setSelectAll(!selectAll);
    };
  
    // Handle bulk delete
    const handleBulkDelete = () => {
      
      if (selectedProducts.length === 0) return alert("No products selected");
      if (confirm(`Delete ${selectedProducts.length} products?`)) {
       deleteProducts(selectedProducts);
       setSelectedProducts([]);
       setSelectAll(false);
       fetchProducts();
    };
    }
  
    // Handle bulk edit (you can open a modal or do inline edits)
    const handleBulkEdit = () => {
      if (selectedProducts.length === 0) return alert("No products selected");
      updateProducts(selectedProducts, { name: "Updated Product" });
      setSelectedProducts([]);
      setSelectAll(false);
    };
  

  const totalPages = Math.ceil(total / take);

  return (
    <div className="flex flex-col space-y-4 h-full w-3/4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products Management</h1>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Product
        </button>
        <button onClick={handleBulkUpload} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Bulk product upload</button>
        <AddProductModal open={open} onClose={() => setOpen(false) } isBulk={isBulk} />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error?.message}</p>}

      {!loading && products.length === 0 && <p>No products found</p>}

      {products.length > 0 && (
        <div className="overflow-x-auto">
          {/* Bulk Actions */}
          <div className="flex justify-between items-center mb-3">
            <div>
              <button
                onClick={handleBulkEdit}
                disabled={selectedProducts.length === 0}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 disabled:opacity-50 mr-2"
              >
                Bulk Edit
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={selectedProducts.length === 0}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
              >
                Bulk Delete
              </button>
            </div>
            {selectedProducts.length > 0 && (
              <span className="text-sm text-gray-600">
                {selectedProducts.length} selected
              </span>
            )}
          </div>

          {/* Product Table */}
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Price</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any, index: number) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id) || selectAll}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="border px-4 py-2">{index + take * page + 1}</td>
                  <td className="border px-4 py-2">{product.name}</td>
                  <td className="border px-4 py-2">{product.description}</td>
                  <td className="border px-4 py-2">${product.price}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleUpdate(product.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {page / take + 1} of {totalPages || 1}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page + take >= total}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
