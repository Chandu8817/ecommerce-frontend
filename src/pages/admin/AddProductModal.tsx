import { useProducts } from "../../hooks/api";
import { useState } from "react";
import { AddProductData } from "../../types";

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  isBulk?: boolean;
}

export default function AddProductModal({ open, onClose,isBulk }: AddProductModalProps) {
  const [product, setProduct] = useState<AddProductData[]>([
    {
    name: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    images: [],
    sizes: [],
    colors: [],
    ageGroup: "",
    gender: "",
    features: [],
    quantity: 0,
    maxQuantity: 0,
  }
]);

  const { addProduct,addProducts } = useProducts();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addProduct(product[0]);
      onClose();
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
  
    reader.onload = (event) => {
      const data = event.target?.result as string;
  
      let products = [];
  
      if (file.type === "application/json" || file.name.endsWith(".json")) {
        // Handle JSON file
        try {
          products = JSON.parse(data);
        } catch (error) {
          console.error("Invalid JSON file", error);
          return;
        }
      } else {
        // Handle CSV file
        const rows = data.split("\n").map((row) => row.split(","));
        products = rows.map((row) => ({
          name: row[0],
          description: row[1],
          price: Number(row[2]),
          stock: Number(row[3]),
          category: row[4],
          images: row[5]?.split(",").map((img) => img.trim()) || [],
          sizes: row[6]?.split(",").map((size) => size.trim()) || [],
          colors: row[7]?.split(",").map((color) => color.trim()) || [],
          ageGroup: row[8],
          gender: row[9],
          features: row[10]?.split(",").map((f) => f.trim()) || [],
          quantity: Number(row[11]),
          maxQuantity: Number(row[12]),
        }));
      }
    
      setProduct(products);
    };
  
    reader.readAsText(file);
  };
  

  const handleBulkUpload = async () => {
    setLoading(true);
    try {
      debugger
      await addProducts(product);
      onClose();
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };
  const handleClose = () => {
    onClose();
    setProduct([
      {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      images: [],
      sizes: [],
      colors: [],
      ageGroup: "",
      gender: "",
      features: [],
      quantity: 0,
      maxQuantity: 0,
    }
    ]);
  };

  if (!open) return null;

  if(isBulk){
    return (

      <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">Add Product Bulk</h1>
        
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
      <input type="file" multiple accept=".csv,.xlsx,.xls,.json" onChange={handleFileUpload} /> 

      <button onClick={handleBulkUpload} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Upload</button>
     
      </div>
  
      
      </div>
    )
  }

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={handleClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-md z-50">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">Add Product</h1>
        
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-2">
            {error.message || "Something went wrong"}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded w-full"
            value={product[0].name}
            onChange={(e) => setProduct([{ ...product[0], name: e.target.value }])}
          />
          <input
            type="text"
            placeholder="Description"
            className="border p-2 rounded w-full"
            value={product[0].description}
            onChange={(e) =>
              setProduct([{ ...product[0], description: e.target.value }])
            }
          />
          <input
            type="number"
            placeholder="Price"
            className="border p-2 rounded w-full"
            value={product[0].price}
            onChange={(e) =>
              setProduct([{ ...product[0], price: Number(e.target.value) }])
            }
          />
          <input
            type="number"
            placeholder="Stock"
            className="border p-2 rounded w-full"
            value={product[0].stock}
            onChange={(e) =>
              setProduct([{ ...product[0], stock: Number(e.target.value) }])
            }
          />
          <input
            type="text"
            placeholder="Category"
            className="border p-2 rounded w-full"
            value={product[0].category}
            onChange={(e) =>
              setProduct([{ ...product[0], category: e.target.value }])
            }
          />
          <input
            type="text"
            placeholder="Images (comma separated)"
            className="border p-2 rounded w-full"
            value={product[0].images.join(",")}
            onChange={(e) =>
              setProduct([{ ...product[0], images: e.target.value.split(",") }])
            }
          />
          <input
            type="text"
            placeholder="Sizes (comma separated)"
            className="border p-2 rounded w-full"
            value={product[0]?.sizes?.join(",")}
            onChange={(e) =>
              setProduct([{ ...product[0], sizes: e.target.value.split(",") }])
            }
          />
          <input
            type="text"
            placeholder="Colors (comma separated)"
            className="border p-2 rounded w-full"
            value={product[0]?.colors?.join(",")}
            onChange={(e) =>
              setProduct([{ ...product[0], colors: e.target.value.split(",") }])
            }
          />
          <input
            type="text"
            placeholder="Age Group"
            className="border p-2 rounded w-full"
            value={product[0].ageGroup}
            onChange={(e) =>
              setProduct([{ ...product[0], ageGroup: e.target.value }])
            }
          />
          <input
            type="text"
            placeholder="Gender"
            className="border p-2 rounded w-full"
            value={product[0].gender}
            onChange={(e) =>
              setProduct([{ ...product[0], gender: e.target.value }])
            }
          />
          <input
            type="text"
            placeholder="Features (comma separated)"
            className="border p-2 rounded w-full"
            value={product[0].features.join(",")}
            onChange={(e) =>
              setProduct([{ ...product[0], features: e.target.value.split(",") }])
            }
          />
          <input
            type="number"
            placeholder="Quantity"
            className="border p-2 rounded w-full"
            value={product[0].quantity}
            onChange={(e) =>
              setProduct([{ ...product[0], quantity: Number(e.target.value) }])
            }
          />
          <input
            type="number"
            placeholder="Max Quantity"
            className="border p-2 rounded w-full"
            value={product[0].maxQuantity}
            onChange={(e) =>
              setProduct([{ ...product[0], maxQuantity: Number(e.target.value) }])
            }
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
}
