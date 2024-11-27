import { RiDeleteBin6Line } from "react-icons/ri";
import { useState } from "react";

const Note = ({ title }) => {
  const [isDelete, setIsDelete] = useState(false);

  const handleDelete = () => {
    setIsDelete(false);
  };
  return (
    <div className="relative flex items-center justify-between w-full p-2 border rounded-md shadow-sm shadow-slate-300">
      <span>{title}</span>
      {!isDelete && (
        <button
          onClick={() => setIsDelete(true)}
          className=" hover:text-red-600"
        >
          <RiDeleteBin6Line />
        </button>
      )}
      {isDelete ? (
        <div className="absolute flex gap-2 text-xs font-semibold bg-white right-2">
          <span>DELETE ?</span>
          <button onClick={handleDelete} className=" hover:text-red-600">
            YES
          </button>
          <button onClick={handleDelete} className=" hover:text-blue-600">
            NO
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Note;
