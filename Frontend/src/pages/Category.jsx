import CategoryModal from '@/components/model/CategoryModal';
import Confirm from '@/components/model/Confirm';
import { deleteCategoryData } from '@/components/model/confirmdata';
import { useCategoryStore } from '@/components/store/categoryStore';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Category = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { categories, fetchCategories, deleteCategory } = useCategoryStore();

  useEffect(() => { fetchCategories(); }, []);

  const handleAddNew = () => { setSelectedCategory(null); setOpenModal(true); };
  const handleEdit = (category) => { setSelectedCategory(category); setOpenModal(true); };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    await deleteCategory(categoryToDelete.id);
    setShowModal(false);
    setCategoryToDelete(null);
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
          <button onClick={handleAddNew} className="flex items-center gap-2 bg-indigo-800 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-600 transition-transform transform hover:scale-105 cursor-pointer">
            <FaPlus /> Add New
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-gray-200 transition-colors duration-200">
                  <td className="py-3 px-4">{category.name}</td>
                  <td className="py-3 px-4">{category.description}</td>
                  <td className="py-3 px-4">{category.created_at}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex item-center justify-center gap-4">
                      <button onClick={() => handleEdit(category)} className="p-2 rounded-md hover:text-blue-500 transition-colors" aria-label="Edit">
                        <FaEdit />
                      </button>
                      <button className="p-2 rounded-md hover:text-red-500 transition-colors" aria-label="Delete"
                              onClick={() => { setCategoryToDelete(category); setShowModal(true); }}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {categories.length === 0 && (
          <p className="text-center text-gray-500 mt-6">No categories found. Click "Add New" to get started!</p>
        )}
      </div>

      {openModal && <CategoryModal onClose={() => setOpenModal(false)} category={selectedCategory} />}

      {showModal && (
        <Confirm
          onClose={() => setShowModal(false)}
          onConfirm={handleDelete}
          title={deleteCategoryData.title}
          message={deleteCategoryData.message}
          buttonText={deleteCategoryData.buttonText}
          Icon={deleteCategoryData.Icon}
            buttonColor={deleteCategoryData.buttonColor}
              iconBgColor={deleteCategoryData.iconBgColor}   // dynamic background
            iconColor={deleteCategoryData.iconColor}   
        />
      )}
    </div>
  );
};

export default Category;
