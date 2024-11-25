const Dashboard = () => {
  return (
    <div className="flex flex-col p-5">
      <div className="flex items-center justify-between w-full gap-2 pt-5 md:pt-0 md:justify-start">
        <div className="flex gap-3">
          <img src="small_icon.svg" alt="icon" className="" />
          <h1 className="text-2xl ">Dashboard</h1>
        </div>
        <div className="text-blue-500 underline underline-offset-2">
          Sign Out
        </div>
      </div>
      <div className="flex flex-col items-start justify-center px-5 py-6 mt-10 border rounded-lg shadow-sm border-slate-300 shadow-slate-400">
        <h1 className="text-2xl font-bold ">
          Welcome, <span>User Name !</span>
        </h1>
        <p className="py-2">
          Email: <span>User email</span>
        </p>
      </div>
      <div>
        <button
          type="submit"
          className="w-full py-4 mt-5 font-semibold text-center text-white bg-blue-500 rounded-xl sm:text-base hover:bg-blue-600"
        >
          Create Note
        </button>
      </div>
      <div className="mt-5">Notes</div>
    </div>
  );
};

export default Dashboard;
