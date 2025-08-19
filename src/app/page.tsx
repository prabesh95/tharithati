"use client";
import { useEffect, useState } from "react";

type Bid = {
  slNo: string;
  ifbNo: string;
  projectTitle: string;
  publicEntity: string;
  procurementType: string;
  status: string;
  noticeDate: string;
  lastBidDate: string;
  daysLeft: string;
};

export default function Home() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [filteredBids, setFilteredBids] = useState<Bid[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(30);
  const [selectedRows, setSelectedRows] = useState<Bid[]>([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/bolpatra.json")
      .then((res) => res.json())
      .then((data: Bid[]) => {
        setBids(data);
        setFilteredBids(data);
      })
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  useEffect(() => {
    const filtered = bids.filter((bid) =>
      Object.values(bid).some((val) =>
        val.toLowerCase().includes(search.toLowerCase())
      )
    );
    setFilteredBids(filtered);
    setCurrentPage(1);
  }, [search, bids]);

  const handleSelect = (bid: Bid) => {
    setSelectedRows((prev) =>
      prev.includes(bid) ? prev.filter((r) => r !== bid) : [...prev, bid]
    );
  };

  const handleSelectBatch = (count: number) => {
    setSelectedRows(filteredBids.slice(0, count));
  };

  const handleSend = () => {
    fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, selectedRows: selectedRows }),
    })
      .then((res) => res.json())
      .then((res) => alert("Email sent!"))
      .catch((err) => console.error(err));
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentRows = filteredBids.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBids.length / rowsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Bolpatra Bids</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded flex-1"
        />

        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => setSelectedRows([...filteredBids])}
          >
            Select All
          </button>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => handleSelectBatch(10)}
          >
            Select 10
          </button>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => handleSelectBatch(20)}
          >
            Select 20
          </button>
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={() => setSelectedRows([])}
          >
            Select None
          </button>
        </div>

        <div className="flex gap-2 ml-auto">
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button
            className="bg-green-500 text-white px-3 py-1 rounded"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
      </div>

      <table className="w-full text-sm border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th></th>
            <th>Sl. No.</th>
            <th>IFB No.</th>
            <th>Project Title</th>
            <th>Public Entity</th>
            <th>Procurement Type</th>
            <th>Status</th>
            <th>Notice Date</th>
            <th>Last Bid Date</th>
            <th>Days Left</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row)}
                  onChange={() => handleSelect(row)}
                />
              </td>
              <td>{row.slNo}</td>
              <td>{row.ifbNo}</td>
              <td>{row.projectTitle}</td>
              <td>{row.publicEntity}</td>
              <td>{row.procurementType}</td>
              <td>{row.status}</td>
              <td>{row.noticeDate}</td>
              <td>{row.lastBidDate}</td>
              <td>{row.daysLeft}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-4">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
