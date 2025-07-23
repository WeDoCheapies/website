
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CarFiltersProps {
  onFilterChange: (filters: any) => void;
  makes: string[];
  years?: number[];
}

const CarFilters = ({ onFilterChange, makes, years = [] }: CarFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("All");
  const [make, setMake] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onFilterChange({ 
        searchTerm, 
        status: status === "All" ? "" : status, 
        make,
        year: year ? parseInt(year) : undefined 
      });
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, status, make, year, onFilterChange]);

  // Get unique years for the filter if not provided
  const uniqueYears = years.length > 0 ? years : [];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <Input
          type="text"
          placeholder="Search by make, model or year..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>
      
      <div className="w-full md:w-40">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="All">All Status</option>
          <option value="Available">Available</option>
          <option value="Reserved">Reserved</option>
          <option value="Sold">Sold</option>
        </select>
      </div>

      <div className="w-full md:w-40">
        <select
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">All Makes</option>
          {makes.map((make, index) => (
            <option key={index} value={make}>
              {make}
            </option>
          ))}
        </select>
      </div>

      {uniqueYears.length > 0 && (
        <div className="w-full md:w-40">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="">All Years</option>
            {uniqueYears
              .sort((a, b) => b - a) // Sort years in descending order
              .map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default CarFilters;
