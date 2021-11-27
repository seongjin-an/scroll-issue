import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import './index.css'
import {throttle} from "throttle-debounce";

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

function App() {
  const listRef = useRef<HTMLUListElement>(null)
  const currentPageRef = useRef<number>(0)
  const [passengers, setPassengers] = useState<IPassenger[]>([])
  const [isLast, setIsLast] = useState<boolean>(false);
  const [isScrollBottom, setIsScrollBottom] = useState<boolean>(false);

  const getPassengers = async (init?: boolean) => {
    const params = { page: currentPageRef.current, size: 30 };
    try{
      const response = await axios.get('https://api.instantwebtools.net/v1/passenger', { params })
      const passengers = response.data.data;
      const isLast = response.data.totalPages === currentPageRef.current;

      init? setPassengers(passengers) : setPassengers( prev => [...prev, ...passengers]);
      setIsLast(isLast)
    }catch(e){
      console.error(e);
    }
  }
  const handleScroll = throttle(1000, () => {
    if(listRef.current){
      const { scrollHeight, offsetHeight, scrollTop } = listRef.current;
      const offset = 50;
      console.log('trigger')
      setIsScrollBottom(scrollHeight - offsetHeight - scrollTop < offset);

      // console.log(scrollTop, scrollHeight, offsetHeight);
    }
  })

  useEffect(() => {
    if(isScrollBottom){
      currentPageRef.current += 1;
      !isLast && getPassengers();
    }
  },[isScrollBottom, isLast])

  useEffect(() => {
    getPassengers(true);
  }, [])

  return (
    <div className="App">
      <ul ref={listRef} className="list" onScroll={handleScroll}>
        <li className="item"></li>
        {
            passengers.map(passenger => (
                <li key={passenger._id}>{passenger.name}</li>
            ))
        }
      </ul>
    </div>
  );
}

export default App;
