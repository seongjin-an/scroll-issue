import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import useIntersectionObserver from "./hooks/useIntersectionObserver";

interface IAirline{
  id: number
  name: string
  country: string
  logo: string
  slogan: string
  head_quaters: string
  website: string
  established: string
}

interface IPassenger{
  _id: string
  name: string
  trips: number
  airline: IAirline
  __v: number
}
interface IProps{
  isLastItem: boolean
  onFetchMorePassengers: () => void
}
const Passenger:React.FC<IProps> = ({isLastItem, onFetchMorePassengers, children}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const entry = useIntersectionObserver(ref, {});
  const isInterseting = !!entry?.isIntersecting

  useEffect(() => {
    isLastItem && isInterseting && onFetchMorePassengers();
  }, [isLastItem, isInterseting])
  return(
      <div ref={ref} style={{minHeight: '100vh', display: 'flex', border: '1px dashed #000'}}>
        {children}
      </div>
  )
}
function App() {

  const [passengers, setPassengers] = useState<IPassenger[]>([])
  const [isLast, setIsLast] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);

  const getPassengers = async () => {
    const params = { size: 10, page };
    try{
      const res = await axios.get('https://api.instantwebtools.net/v1/passenger', { params })
      const passengers = res.data.data;
      const isLast = res.data.totalPages === page;

      setPassengers(prev => [...prev, ...passengers]);
    }catch(e){
      console.error(e);
    }
  }

  useEffect(() => {
    !isLast && getPassengers();
  }, [page])
  return (
    <div>
      {
        passengers.map((passenger, index) => (
          <Passenger
              key={passenger._id}
              isLastItem={passengers.length - 1 === index}
              onFetchMorePassengers={() => setPage(prev => prev + 1)}>
            {passenger.name}
          </Passenger>
        ))
      }
    </div>
  );
}

export default App;
