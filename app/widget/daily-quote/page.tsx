
let getData = async () => {
  try {
    const response = await fetch("https://favqs.com/api/qotd",
      {
        method: 'get',
        mode: 'no-cors',
        headers: { "Content-Type": "application/json" }
      });
    console.log("detail: ", response.statusText);
    const quotes = await response.json();
    return quotes.quote;

  } catch (error) {
    console.error("Error:", error);
  }
};

export default async function Page() {
  let colors  = ['sky', 'indigo', 'slate', 'lime', 'violet'];
  let color = colors[Math.floor(Math.random() * colors.length-1 )];
  let quoteOftheDay = await getData();

  
  return (
    <div className="container flex flex-col items-center justify-center h-screen mx-auto px-4 text-xl font-mono
      ">
      <div className={`flex py-5 text-slate-500 `}>
        <span className="text-6xl tracking-tight px-2">&lsquo;&lsquo;</span>
        <h1 className="text-lg font-bold">{quoteOftheDay.body}</h1>
        <span className="text-6xl  tracking-tight px-2">&rsquo;&rsquo;</span>
      </div>
      <h3 className={`w-full text-base text-right text-slate-400`}>
        <a href={quoteOftheDay.url} target='blanck'>{quoteOftheDay.author}</a>
      </h3>
    </div>
  )
}