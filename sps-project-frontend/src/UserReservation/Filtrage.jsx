import {
  Bath,
  BedDouble,
  CalendarIcon,
  ChevronDown,
  Search,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { addDays, format } from "date-fns";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { FiltrageAction } from "@/redux/actions/ChambreAction";
function Filtrage() {
  const fitragesDonner = useSelector((state) => state.Chambre.filters);
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 1),
  });
  const [filters, setFiltersState] = useState({
    destination: "",
    date: { from: new Date(), to: addDays(new Date(), 1) },
    guests: 1,
    beds: 1,
    bathrooms: 1,
    floor: [],
  });
  const dispatch = useDispatch();



// function envoyer les donner de filtres vers redux pour axxisble les uatre composan comme form resrever
  const updateFiltrage = (key, value) => {
    setFiltersState((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    dispatch(FiltrageAction({ ...filters, [key]: value }));
  };


  // function qui permet de choisir plusieure etage de filtrage  et dsipatcher vers redux
  const hanelFiltreFloor = (floor) => {
    setFiltersState((prevFiltres) => {
      const updatedFloor = prevFiltres.floor.includes(floor)
        ? prevFiltres.floor.filter((f) => f !== floor)
        : [...prevFiltres.floor, floor];
      return { ...prevFiltres, floor: updatedFloor };
    });
    dispatch(FiltrageAction({ ...filters, floor: filters.floor.includes(floor) ? filters.floor.filter(f => f !== floor) : [...filters.floor, floor] }));

  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      <div className="flex flex-col gap-2 ">
        <label>Destiniation </label>
        <div className="relative  w-full justify-between text-left font-normal  bg-gray-100 raduis-button">
          <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-950" />
          <Input
            id="destination"
            className="marginLeft"
            placeholder="Où allez-vous ?"
            value={filters.destination}
            onChange={(e) => {
              updateFiltrage("destination", e.target.value);
            }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-2 ">
        <label>chosi votre date </label>
        <Popover className="bg-gray-700">
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                " py-2 px-6 raduis-button file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent   text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive   justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0  z-[99999999999999999999]"
            align="start"
          >
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(range) => {
                setDate(range);
                updateFiltrage("date", range);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-2 ">
        <label>capacite </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between text-left font-normal  bg-gray-100 raduis-button"
            >
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>
                  {filters.guests}{" "}
                  {filters.guests > 1 ? "personnes" : "personne"}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 ">
            <div className="space-y-2 p-2 ">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Personnes</h4>
                  <p className="text-sm text-muted-foreground">
                    Nombre de voyageurs
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    className="raduis-button"
                    variant="outline"
                    size="icon"
                    onClick={() => updateFiltrage("guests", filters.guests - 1)}
                    disabled={filters.guests <= 1}
                  >
                    -
                  </Button>
                  <span className="w-8 text-center">{filters.guests}</span>
                  <Button
                    className="raduis-button"
                    variant="outline"
                    size="icon"
                    onClick={() => updateFiltrage("guests", filters.guests + 1)}
                    disabled={filters.guests >= 10}
                  >
                    +
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-2 ">
        <label>nombre lit </label>
        <div className="flex gap-2">
          <Button
            className="bg-gray-100 raduis-button"
            variant="outline"
            size="icon"
            onClick={() => updateFiltrage("beds", filters.beds - 1)}
            disabled={filters.beds <= 1}
          >
            -
          </Button>
          <div className=" py-2 px-8 items-center  justify-center  raduis-button file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9  min-w-0 rounded-md border bg-transparent   text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-full    text-left font-normal  text-muted-foreground">
            <BedDouble className="h-4 w-4 mr-2 text-muted-foreground" />

            <span>
              {filters.beds} {filters.beds > 1 ? "lits" : "lit"}
            </span>
          </div>
          <Button
            className="bg-gray-100 raduis-button"
            variant="outline"
            size="icon"
            onClick={() => updateFiltrage("beds", filters.beds + 1)}
            disabled={filters.beds >= 10}
          >
            +
          </Button>
          <div></div>
        </div>
      </div>
      <div className="flex flex-col gap-2 ">
        <label>Salles de bain  </label>
        <div className="flex gap-2">
          <Button
            className="bg-gray-100 raduis-button"
            variant="outline"
            size="icon"
            onClick={() => updateFiltrage("bathrooms", filters.bathrooms - 1)}
            disabled={filters.bathrooms <= 1}
          >
            -
          </Button>
          <div className=" py-2 px-8 items-center  justify-center  raduis-button file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9  min-w-0 rounded-md border bg-transparent   text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-full    text-left font-normal  text-muted-foreground">
            <Bath className="h-4 w-4 mr-2 text-muted-foreground" />
          

            <span>
              {filters.bathrooms}{" "}
              {filters.bathrooms > 1 ? "Salles de bain" : "Salles de bain"}
            </span>
          </div>
          <Button
            className="bg-gray-100 raduis-button"
            variant="outline"
            size="icon"
            onClick={() => updateFiltrage("bathrooms", filters.bathrooms + 1)}
            disabled={filters.bathrooms >= 10}
          >
            +
          </Button>
          <div></div>
        </div>
      </div>
      <div className="flex flex-col gap-2 ">
        <label>Etage </label>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, , 4, 5].map((f, index) => (
            <Button
              key={index}
              className={cn(
                "raduis-button btn-style-reserver shadow-sm ",
                filters.floor.includes(f)
                  ? "bg-blue-700  hover:bg-blue-500 text-white  "
                  : "bg-gray-100 hover:bg-gray-200"
              )}
              onClick={() => hanelFiltreFloor(f)}           
               >
              {f}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Filtrage;
