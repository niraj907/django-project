import CategoryModal from '@/components/model/CategoryModal';
import Confirm from '@/components/model/Confirm';
import { deleteCategoryData } from '@/assets/constants/confirmdata';
import { useCategoryStore } from '@/components/store/categoryStore';
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const Category = () => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const { categories, fetchCategories, deleteCategory } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddNew = () => {
    setSelectedCategory(null);
    setOpenModal(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setOpenModal(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;
    await deleteCategory(categoryToDelete.id);
    setShowModal(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 font-outfit tracking-tight">Manage Categories</h1>
            <p className="text-gray-500 text-sm mt-1 font-outfit">Organize your transactions with custom categories.</p>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all active:scale-95 whitespace-nowrap"
          >
            <FaPlus size={14} /> Add Category
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="py-4 px-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Category Name</th>
                <th className="py-4 px-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Description</th>
                <th className="py-4 px-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Created At</th>
                <th className="py-4 px-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((category) => (
                <tr key={category.id} className="transition-colors hover:bg-gray-50/50 group">
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span className="font-bold text-gray-800 font-outfit">{category.name}</span>
                    </div>
                  </td>
                  <td className="py-5 px-4 text-gray-500 text-sm italic font-medium">
                    {category.description || "No description provided."}
                  </td>
                  <td className="py-5 px-4 text-xs text-gray-400 font-bold uppercase tracking-tight">
                    {new Date(category.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="py-5 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                        title="Edit category"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setCategoryToDelete(category);
                          setShowModal(true);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete category"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {categories.length === 0 && (
          <div className="text-center py-20 bg-gray-50/50 rounded-2xl mt-6 border-2 border-dashed border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm mb-4">
              <FaPlus className="text-gray-300 w-6 h-6" />
            </div>
            <h3 className="text-gray-900 font-bold text-lg">No Categories Yet</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">Create your first category to start organizing your financial data.</p>
            <button
              onClick={handleAddNew}
              className="mt-6 text-indigo-600 font-bold text-sm hover:underline"
            >
              Create One Now &rarr;
            </button>
          </div>
        )}
      </div>

      {openModal && (
        <CategoryModal
          onClose={() => setOpenModal(false)}
          category={selectedCategory}
        />
      )}

      {showModal && (
        <Confirm
          onClose={() => setShowModal(false)}
          onConfirm={handleDelete}
          title={deleteCategoryData.title}
          message={deleteCategoryData.message}
          buttonText={deleteCategoryData.buttonText}
          Icon={deleteCategoryData.Icon}
          buttonColor={deleteCategoryData.buttonColor}
          iconBgColor={deleteCategoryData.iconBgColor}
          iconColor={deleteCategoryData.iconColor}
        />
      )}
    </div>
  );
};

export default Category;
