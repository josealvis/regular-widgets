
'use client'
import { useState, useEffect } from 'react'
//import axios from 'axios';

interface IQuote{
  body: string,
  url: string,
  author:string

} 


let getData = async ():Promise<IQuote>   => {
    const response = await fetch("https://api.allorigins.win/raw?url=https://favqs.com/api/qotd");
    const jsonRes = await response.json();
    return (jsonRes.quote as IQuote)
};


export default  function Page() {
  // TODO: Add  varible  color styles to the quotes.
  //let colors  = ['sky', 'indigo', 'slate', 'lime', 'violet'];
  //let color = colors[Math.floor(Math.random() * colors.length-1 )];
  const [quoteOftheDay, setData] = useState<IQuote>()
  const [isLoading, setLoading] = useState(true)

  const  array: Array<IQuote> = []


  useEffect(() => {
    async function callData(){
        let quote:IQuote = await  getData();// TODO: manage exception  here.
        if(quote !== null){
        setData(quote)
        setLoading(false)
        }
   }

   callData();

  }, [])

  return (
    <div className="container flex flex-col items-center justify-center h-screen mx-auto px-4 text-xl font-mono">
      {isLoading? 
      <div> Loading...</div>:
      <>
      <div className={`flex py-5 text-slate-500 `}>
        <span className="text-6xl tracking-tight px-2">&lsquo;&lsquo;</span>
        <h1 className="text-lg font-bold">{quoteOftheDay?.body}</h1>
        <span className="text-6xl  tracking-tight px-2">&rsquo;&rsquo;</span>
      </div>
      <h3 className={`w-full text-base text-right text-slate-400`}>
        <a href={quoteOftheDay?.url} target='blanck'>{quoteOftheDay?.author}</a>
      </h3>
      </>}
    </div>
  )
}