import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBatch, deleteBatch, addBatch } from "../../../redux/actions/adminActions";
import Spinner from "../../../utils/Spinner";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const Body = () => {
  const dispatch = useDispatch();
  const batches = useSelector((state) => state.admin.allBatch);
  const store = useSelector((state) => state);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [syear, setSyear] = useState("");
  const [eyear, setEyear] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(getAllBatch());
  }, [dispatch]);

  useEffect(() => {
    if (store.errors) {
      setError(store.errors);
      setLoading(false);
    }
  }, [store.errors]);

  const handleDelete = (batch) => {
    setLoading(true);
    dispatch(deleteBatch({ startYear: batch.startYear, endYear: batch.endYear }))
      .then(() => {
        dispatch(getAllBatch());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError({});
    dispatch(addBatch({ syear, eyear })).then(() => {
      setSyear("");
      setEyear("");
      dispatch(getAllBatch());
      setLoading(false);
      setShowForm(false);
    });
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow-md w-[80%] mx-auto mt-5">
      <h1 className="text-xl font-bold text-gray-700 mb-4 text-center">Batch Management</h1>

      {/* Show Add Form Above Table When Button Clicked */}
      {showForm && (
        <div className="bg-gray-100 p-4 rounded-md shadow-md mb-4 w-[60%] mx-auto">
          <h2 className="text-lg font-semibold mb-2 text-center">Add New Batch</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="number"
              min="2000"
              required
              value={syear}
              onChange={(e) => setSyear(e.target.value)}
              placeholder="Start Year"
              className="w-full p-2 border rounded"
            />
            <input
              type="number"
              min="2000"
              required
              value={eyear}
              onChange={(e) => setEyear(e.target.value)}
              placeholder="End Year"
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-center space-x-4">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Batch Table */}
      <div className="overflow-x-auto w-[70%] mx-auto">
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Start Year</th>
              <th className="px-4 py-2 text-left">End Year</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => (
              <tr key={batch._id} className="border-t">
                <td className="px-4 py-2">{batch.startYear}</td>
                <td className="px-4 py-2">{batch.endYear}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDelete(batch)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Button Below Table */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-6 py-2 rounded flex items-center"
        >
          <AddIcon fontSize="small" className="mr-2" /> Add New Batch
        </button>
      </div>

      {/* Loading & Error Handling */}
      {loading && <Spinner message="Processing..." height={30} width={150} color="#111" />}
      {error.batchError && <p className="text-red-500 mt-2">{error.batchError}</p>}
    </div>
  );
};

export default Body;

