
'use client'
import { useState, useEffect } from 'react'
import axios from 'axios';

export default  function Page() {
  //let colors  = ['sky', 'indigo', 'slate', 'lime', 'violet'];
  //let color = colors[Math.floor(Math.random() * colors.length-1 )];
  const [quoteOftheDay, setData] = useState<Quote>()
  const [isLoading, setLoading] = useState(true)

  interface Response{
    data: {
      quote : Quote
    }
  } 
  
  interface Quote{
    body: string,
    url: string,
    author:string

  } 

  useEffect(() => {
    axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
    axios.get('https://api.allorigins.win/raw?url=https://favqs.com/api/qotd')
        .then(function (response: Response) {
    // handle success
    console.log(response);
    console.log("response: ", response)
        setData(response.data.quote)
        setLoading(false)
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
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